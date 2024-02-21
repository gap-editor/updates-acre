import { ChainIdentifier, TBTC } from "@keep-network/tbtc-v2.ts"
import { AcreContracts } from "../../lib/contracts"
import { ChainEIP712Signer } from "../../lib/eip712-signer"
import { StakeInitialization } from "./stake-initialization"

/**
 * Module exposing features related to the staking.
 */
class StakingModule {
  /**
   * Acre contracts.
   */
  readonly #contracts: AcreContracts

  /**
   * Typed structured data signer.
   */
  readonly #messageSigner: ChainEIP712Signer

  /**
   * tBTC SDK.
   */
  readonly #tbtc: TBTC

  constructor(
    _contracts: AcreContracts,
    _messageSigner: ChainEIP712Signer,
    _tbtc: TBTC,
  ) {
    this.#contracts = _contracts
    this.#messageSigner = _messageSigner
    this.#tbtc = _tbtc
  }

  /**
   * Initializes the Acre staking process.
   * @param bitcoinRecoveryAddress P2PKH or P2WPKH Bitcoin address that can be
   *                               used for emergency recovery of the deposited
   *                               funds.
   * @param staker The address to which the stBTC shares will be minted.
   * @param referral Data used for referral program.
   * @returns Object represents the staking process.
   */
  async initializeStake(
    bitcoinRecoveryAddress: string,
    staker: ChainIdentifier,
    referral: number,
  ) {
    const deposit = await this.#tbtc.deposits.initiateDepositWithProxy(
      bitcoinRecoveryAddress,
      this.#contracts.tbtcDepositor,
      this.#contracts.tbtcDepositor.encodeExtraData(staker, referral),
    )

    return new StakeInitialization(
      this.#contracts,
      this.#messageSigner,
      bitcoinRecoveryAddress,
      staker,
      deposit,
    )
  }

  /**
   * @param identifier The generic chain identifier.
   * @returns Value of the basis for calculating final BTC balance.
   */
  sharesBalance(identifier: ChainIdentifier) {
    return this.#contracts.stBTC.balanceOf(identifier)
  }

  /**
   * @param identifier The generic chain identifier.
   * @returns Maximum withdraw value.
   */
  estimatedBitcoinBalance(identifier: ChainIdentifier) {
    return this.#contracts.stBTC.assetsBalanceOf(identifier)
  }
}

export { StakingModule, StakeInitialization }
