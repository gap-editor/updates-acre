import React, { useCallback, useEffect, useState } from "react"
import {
  useExecuteFunction,
  useModalFlowContext,
  useStakeFlowContext,
  useToast,
} from "#/hooks"
import { logPromiseFailure } from "#/utils"
import { PROCESS_STATUSES, TOASTS, TOAST_IDS } from "#/types"
import { ReceiveSTBTCAlert } from "#/components/shared/alerts"
import StakingStepsModalContent from "./StakingStepsModalContent"

const TOAST_ID = TOAST_IDS.SIGNING_ERROR
const TOAST = TOASTS[TOAST_ID]

export default function SignMessageModal() {
  const { goNext, setStatus } = useModalFlowContext()
  const { signMessage } = useStakeFlowContext()
  const [buttonText, setButtonText] = useState("Sign now")
  const { closeToast, openToast } = useToast()

  useEffect(() => {
    setStatus(PROCESS_STATUSES.PENDING)
  }, [setStatus])

  const onSignMessageSuccess = useCallback(() => {
    closeToast(TOAST_ID)
    goNext()
  }, [closeToast, goNext])

  const onSignMessageError = useCallback(() => {
    openToast({
      id: TOAST_ID,
      render: TOAST,
    })
    setButtonText("Try again")
  }, [openToast])

  const handleSignMessage = useExecuteFunction(
    signMessage,
    onSignMessageSuccess,
    onSignMessageError,
  )

  const handleSignMessageWrapper = useCallback(() => {
    logPromiseFailure(handleSignMessage())
  }, [handleSignMessage])

  return (
    <StakingStepsModalContent
      buttonText={buttonText}
      activeStep={0}
      onClick={handleSignMessageWrapper}
    >
      <ReceiveSTBTCAlert />
    </StakingStepsModalContent>
  )
}
