import { useAcreContext } from "#/acre-react/hooks"
import { useQuery } from "@tanstack/react-query"
import { INTERVAL_TIME_IN_MILLISECONDS } from "#/constants"

export default function useBTCBalance() {
  const { acre, isInitialized } = useAcreContext()

  return useQuery({
    queryKey: ["BTCBalance", { acre, isInitialized }],
    queryFn: async () => {
      if (!isInitialized || !acre)
        return { sharesBalance: 0n, estimatedBitcoinBalance: 0n }

      const sharesBalance = await acre.account.sharesBalance()
      const estimatedBitcoinBalance =
        await acre.account.estimatedBitcoinBalance()

      return { sharesBalance, estimatedBitcoinBalance }
    },
    refetchInterval: INTERVAL_TIME_IN_MILLISECONDS,
  })
}
