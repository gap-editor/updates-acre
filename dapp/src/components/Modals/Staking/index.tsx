import React from "react"
import { useModalFlowContext } from "~/hooks"
import ModalBase from "~/components/shared/ModalBase"
import Overview from "./Overview"
import ActionForm from "../ActionForm"
import SignMessage from "./SignMessage"
import DepositBTC from "./DepositBTC"

function ActiveStakingStep() {
  const { activeStep } = useModalFlowContext()

  switch (activeStep) {
    case 1:
      return <ActionForm action="stake" />
    case 2:
      return <Overview />
    case 3:
      return <SignMessage />
    case 4:
      return <DepositBTC />
    default:
      return null
  }
}

export default function StakingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} numberOfSteps={4}>
      <ActiveStakingStep />
    </ModalBase>
  )
}
