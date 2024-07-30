import { Referral, REFERRALS } from "#/types"
import { useMemo, useCallback } from "react"
import useLocalStorage from "./useLocalStorage"

const PARAM_NAME = "ref"

function isOfTypeReferral(keyInput: number): keyInput is Referral {
  const referral = Object.values(REFERRALS) as number[]
  return referral.includes(keyInput)
}

type UseReferralReturn = {
  referral?: Referral
  detectReferral: () => void
  resetReferral: () => void
}

export default function useReferral(): UseReferralReturn {
  const [referral, setReferral] = useLocalStorage<Referral | undefined>(
    "referral",
    undefined,
  )

  const detectReferral = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    const detectedReferral = params.get(PARAM_NAME)

    if (detectedReferral && isOfTypeReferral(parseInt(detectedReferral, 10))) {
      setReferral(detectedReferral)
    }
  }, [setReferral])

  const resetReferral = useCallback(() => {
    setReferral(undefined)
  }, [setReferral])

  return useMemo(
    () => ({
      detectReferral,
      resetReferral,
      referral,
    }),
    [detectReferral, resetReferral, referral],
  )
}
