import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Connector,
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
} from "wagmi"
import { logPromiseFailure, orangeKit } from "#/utils"
import { OnErrorCallback, OnSuccessCallback } from "#/types"
import { useBitcoinProvider, useConnector } from "./orangeKit"

type UseWalletReturn = {
  isConnected: boolean
  address?: string
  balance: bigint
  onConnect: (
    connector: Connector,
    options?: { onSuccess?: OnSuccessCallback; onError?: OnErrorCallback },
  ) => void
  onDisconnect: () => void
}

export function useWallet(): UseWalletReturn {
  const chainId = useChainId()
  const { status } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connector = useConnector()
  const provider = useBitcoinProvider()

  const [address, setAddress] = useState<string | undefined>(undefined)
  const [balance, setBalance] = useState<bigint>(0n)

  // `isConnected` is variable derived from `status` but does not guarantee us a set `address`.
  // When `status` is 'connected' properties like `address` are guaranteed to be defined.
  // Let's use `status` to make sure the account is connected.
  const isConnected = useMemo(
    () => orangeKit.isConnectedStatus(status),
    [status],
  )

  const onConnect = useCallback(
    (
      selectedConnector: Connector,
      options?: { onSuccess?: OnSuccessCallback; onError?: OnErrorCallback },
    ) => {
      connect({ connector: selectedConnector, chainId }, options)
    },
    [connect, chainId],
  )

  const onDisconnect = useCallback(() => {
    disconnect()
    // TODO: Reset redux state
  }, [disconnect])

  useEffect(() => {
    const fetchBalance = async () => {
      if (provider) {
        const { total } = await provider.getBalance()

        setBalance(BigInt(total))
      } else {
        setBalance(0n)
      }
    }

    const fetchBitcoinAddress = async () => {
      if (connector) {
        const btcAddress = await connector.getBitcoinAddress()

        setAddress(btcAddress)
      } else {
        setAddress(undefined)
      }
    }

    logPromiseFailure(fetchBalance())
    logPromiseFailure(fetchBitcoinAddress())
  }, [connector, provider])

  return useMemo(
    () => ({
      isConnected,
      address,
      balance,
      onConnect,
      onDisconnect,
    }),
    [address, balance, isConnected, onConnect, onDisconnect],
  )
}
