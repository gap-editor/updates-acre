import React from "react"
import MobileModeBanner from "#/components/MobileModeBanner"
import {
  useBitcoinPosition,
  useMobileMode,
  useTriggerConnectWalletModal,
} from "#/hooks"
import { routerPath } from "#/router/path"
import DashboardCard from "./DashboardCard"
import { PageLayout, PageLayoutColumn } from "./PageLayout"
// import GrantedSeasonPassCard from "./GrantedSeasonPassCard"
import AcrePointsCard from "./AcrePointsCard"
import { CurrentSeasonCard } from "./CurrentSeasonCard"

export default function DashboardPage() {
  const { data } = useBitcoinPosition()
  const isMobileMode = useMobileMode()
  const bitcoinWalletBalance = data?.estimatedBitcoinBalance ?? 0n
  useTriggerConnectWalletModal(routerPath.dashboard)

  return isMobileMode ? (
    <MobileModeBanner forceOpen />
  ) : (
    <PageLayout>
      <PageLayoutColumn isMain>
        <DashboardCard bitcoinAmount={bitcoinWalletBalance} />
      </PageLayoutColumn>

      <PageLayoutColumn>
        <CurrentSeasonCard showSeasonStats={false} />
        {/* TODO: Uncomment in post-launch phases */}
        {/* <GrantedSeasonPassCard /> */}
      </PageLayoutColumn>

      <PageLayoutColumn position="relative">
        <AcrePointsCard />
      </PageLayoutColumn>
    </PageLayout>
  )
}
