import React, { useCallback, useState } from "react"
import {
  useActionFlowPause,
  useActionFlowTokenAmount,
  useAppDispatch,
  useExecuteFunction,
  useInvalidateQueries,
  useModal,
} from "#/hooks"
import { PROCESS_STATUSES } from "#/types"
import { Button } from "@chakra-ui/react"
import { eip1193, logPromiseFailure } from "#/utils"
import { setStatus } from "#/store/action-flow"
import { useInitializeWithdraw } from "#/acre-react/hooks"
import { queryKeys } from "#/constants"
import { activityInitialized } from "#/store/wallet"
import TriggerTransactionModal from "../TriggerTransactionModal"

type WithdrawalStatus = "building-data" | "signature" | "transaction"

const withdrawalStatusToContent: Record<
  WithdrawalStatus,
  { title: string; subtitle: string }
> = {
  "building-data": {
    title: "Building transaction data...",
    subtitle: "We are building your withdrawal data.",
  },
  signature: {
    title: "Waiting signature...",
    subtitle: "Please complete the signing process in your wallet.",
  },
  transaction: {
    title: "Waiting for withdrawal initialization...",
    subtitle: "Withdrawal initialization in progress...",
  },
}

export default function SignMessageModal() {
  const [status, setWaitingStatus] = useState<WithdrawalStatus>("building-data")

  const dispatch = useAppDispatch()
  const tokenAmount = useActionFlowTokenAmount()
  const amount = tokenAmount?.amount
  const { closeModal } = useModal()
  const { handlePause } = useActionFlowPause()
  const initializeWithdraw = useInitializeWithdraw()
  const handleBitcoinPositionInvalidation = useInvalidateQueries({
    queryKey: [queryKeys.BITCOIN_POSITION],
  })

  const onSignMessageCallback = useCallback(async () => {
    setWaitingStatus("signature")
    return Promise.resolve()
  }, [])

  const messageSignedCallback = useCallback(() => {
    setWaitingStatus("transaction")
    dispatch(setStatus(PROCESS_STATUSES.LOADING))
    return Promise.resolve()
  }, [dispatch])

  const onSignMessageSuccess = useCallback(() => {
    handleBitcoinPositionInvalidation()
    dispatch(setStatus(PROCESS_STATUSES.SUCCEEDED))
  }, [dispatch, handleBitcoinPositionInvalidation])

  const onSignMessageError = useCallback(() => {
    dispatch(setStatus(PROCESS_STATUSES.FAILED))
  }, [dispatch])

  const onError = useCallback(
    (error: unknown) => {
      if (eip1193.didUserRejectRequest(error)) {
        handlePause()
      } else {
        onSignMessageError()
      }
    },
    [onSignMessageError, handlePause],
  )

  const handleSignMessage = useExecuteFunction(
    async () => {
      if (!amount) return

      const { redemptionKey } = await initializeWithdraw(
        amount,
        onSignMessageCallback,
        messageSignedCallback,
      )

      dispatch(
        activityInitialized({
          // Note that the withdraw id returned from the Acre SDK while fetching
          // the withdrawals has the following pattern:
          // `<redemptionKey>-<count>`. The redemption key returned during the
          // withdrawal initialization does not contain the `-<count>` suffix
          // because there may be delay between indexing the Acre subgraph and
          // the time when a transaction was actually made and it's hard to get
          // the exact number of the redemptions with the same key. Eg:
          // - a user initialized a withdraw,
          // - the Acre SDK is asking the subgraph for the number of withdrawals
          //   with the same redemption key,
          // - the Acre subgraph may or may not be up to date with the chain and
          //   we are not sure if we should add +1 to the counter or the
          //   returned value already includes the requested withdraw from the
          //   first step. So we can't create the correct withdraw id.
          // So here we set the id as a redemption key. Only one pending
          // withdrawal can exist with the same redemption key, so when the user
          // can initialize the next withdrawal with the same redemption key, we
          // assume the dapp should already re-fetch all withdrawals with the
          // correct IDs and move the `pending` redemption to `completed`
          // section with the proper id.
          id: redemptionKey,
          type: "withdraw",
          status: "pending",
          amount,
          timestamp: new Date().getTime(),
        }),
      )
    },
    onSignMessageSuccess,
    onError,
  )

  const handleInitWithdrawAndSignMessageWrapper = useCallback(() => {
    logPromiseFailure(handleSignMessage())
  }, [handleSignMessage])

  const { title, subtitle } = withdrawalStatusToContent[status]

  return (
    <TriggerTransactionModal
      title={title}
      subtitle={subtitle}
      callback={handleInitWithdrawAndSignMessageWrapper}
    >
      <Button size="lg" width="100%" variant="outline" onClick={closeModal}>
        Cancel
      </Button>
    </TriggerTransactionModal>
  )
}
