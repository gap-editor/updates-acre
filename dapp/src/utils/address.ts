import { BITCOIN_NETWORK } from "#/constants"
import { isPublicKeyHashTypeAddress } from "@acre-btc/sdk"

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-5)}`
}

export const isSupportedBTCAddressType = (address: string): boolean =>
  isPublicKeyHashTypeAddress(address, BITCOIN_NETWORK)
