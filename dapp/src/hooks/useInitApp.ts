import { useAccountChangedOKX } from "./orangeKit/useAccountChangedOKX"
import { useAccountsChangedUnisat } from "./orangeKit/useAccountsChangedUnisat"
import { useAccountsChangedOKX } from "./orangeKit/useAccountsChangedOKX"
import { useInitDataFromSdk, useInitializeAcreSdk } from "./sdk"
import { useSentry } from "./sentry"
import useDetectReferral from "./useDetectReferral"
import { useDisconnectWallet } from "./useDisconnectWallet"
import { useFetchBTCPriceUSD } from "./useFetchBTCPriceUSD"
import useGatingDApp from "./useGatingDApp"

export function useInitApp() {
  // TODO: Let's uncomment when dark mode is ready
  // useDetectThemeMode()
  useSentry()
  useDetectReferral()
  useGatingDApp()
  useInitializeAcreSdk()
  useInitDataFromSdk()
  useFetchBTCPriceUSD()
  useDisconnectWallet()
  useAccountChangedOKX()
  useAccountsChangedOKX()
  useAccountsChangedUnisat()
}
