import { CurrencyType } from "../types"
import { getCurrencyByType } from "./currency"
import { formatTokenAmount } from "./numbers"

const ERRORS = {
  REQUIRED: "Required.",
  EXCEEDED_VALUE: "The amount exceeds your current balance.",
  INSUFFICIENT_VALUE: (minValue: string) =>
    `The minimum amount must be at least ${minValue} BTC.`,
}

export function getErrorsObj<T>(errors: { [key in keyof T]: string }) {
  return (Object.keys(errors) as Array<keyof T>).every((name) => !errors[name])
    ? {}
    : errors
}

export function validateTokenAmount(
  value: string,
  maxValue: string,
  minValue: string,
  currencyType: CurrencyType,
): string | undefined {
  if (!value) return ERRORS.REQUIRED

  const { decimals } = getCurrencyByType(currencyType)
  const valueInBI = BigInt(value)
  const maxValueInBI = BigInt(maxValue)
  const minValueInBI = BigInt(minValue)

  const isMaximumValueExceeded = valueInBI > maxValueInBI
  const isMinimumValueFulfilled = valueInBI >= minValueInBI

  if (isMaximumValueExceeded) return ERRORS.EXCEEDED_VALUE
  if (!isMinimumValueFulfilled)
    return ERRORS.INSUFFICIENT_VALUE(formatTokenAmount(minValue, decimals))

  return undefined
}
