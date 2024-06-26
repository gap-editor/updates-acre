import { useInitDataFromSdk, useInitializeAcreSdk } from "./sdk"
import { useSentry } from "./sentry"
import { useDisconnectWallet } from "./useDisconnectWallet"
import { useFetchBTCPriceUSD } from "./useFetchBTCPriceUSD"

export function useInitApp() {
  // TODO: Let's uncomment when dark mode is ready
  // useDetectThemeMode()
  useSentry()
  useInitializeAcreSdk()
  useInitDataFromSdk()
  useFetchBTCPriceUSD()
  useDisconnectWallet()
}
