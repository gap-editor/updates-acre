import {
  ChainIdentifier,
  EthereumAddress,
  TBTC,
} from "@keep-network/tbtc-v2.ts"
import { OrangeKitSdk } from "@orangekit/sdk"
import { AcreContracts, DepositorProxy, DepositFees } from "../../lib/contracts"
import { ChainEIP712Signer } from "../../lib/eip712-signer"
import { StakeInitialization } from "./stake-initialization"
import { fromSatoshi, toSatoshi } from "../../lib/utils"

/**
 * Represents all total deposit fees grouped by network.
 */
export type DepositFee = {
  tbtc: bigint
  acre: bigint
  total: bigint
}

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

  /**
   * OrangeKit SDK.
   */
  readonly #orangeKit: OrangeKitSdk

  constructor(
    _contracts: AcreContracts,
    _messageSigner: ChainEIP712Signer,
    _tbtc: TBTC,
    _orangeKit: OrangeKitSdk,
  ) {
    this.#contracts = _contracts
    this.#messageSigner = _messageSigner
    this.#tbtc = _tbtc
    this.#orangeKit = _orangeKit
  }

  /**
   * Initializes the Acre deposit process.
   * @param depositor The Bitcoin depositor address. Supported addresses:
   *        `P2WPKH`, `P2PKH`, `P2SH-P2WPKH`.
   * @param referral Data used for referral program.
   * @param depositorProxy Depositor proxy used to initiate the deposit.
   * @param bitcoinRecoveryAddress `P2PKH` or `P2WPKH` Bitcoin address that can
   *        be used for emergency recovery of the deposited funds. If
   *        `undefined` the `depositor` address is used as bitcoin recovery
   *        address then the `depositor` must be `P2WPKH` or `P2PKH`.
   * @returns Object represents the deposit process.
   */
  async initializeStake(
    depositor: string,
    referral: number,
    depositorProxy?: DepositorProxy,
    bitcoinRecoveryAddress?: string,
  ) {
    // TODO: If we want to handle other chains we should create the wrapper for
    // OrangeKit SDK to return `ChainIdentifier` from `predictAddress` fn. Or we
    // can create `EVMChainIdentifier` class and use it as a type in `modules`
    // and `lib`. Currently we support only `Ethereum` so here we force to
    // `EthereumAddress`.
    const depositOwnerChainAddress = EthereumAddress.from(
      await this.#orangeKit.predictAddress(depositor),
    )

    // tBTC-v2 SDK will handle Bitcoin address validation and throw an error if
    // address is not supported.
    const finalBitcoinRecoveryAddress = bitcoinRecoveryAddress ?? depositor

    const deposit = await this.#tbtc.deposits.initiateDepositWithProxy(
      finalBitcoinRecoveryAddress,
      depositorProxy ?? this.#contracts.bitcoinDepositor,
      this.#contracts.bitcoinDepositor.encodeExtraData(
        depositOwnerChainAddress,
        referral,
      ),
    )

    return new StakeInitialization(
      this.#contracts,
      this.#messageSigner,
      finalBitcoinRecoveryAddress,
      depositOwnerChainAddress,
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

  /**
   * Estimates the deposit fee based on the provided amount.
   * @param amount Amount to deposit in satoshi.
   * @returns Deposit fee grouped by tBTC and Acre networks in 1e8 satoshi
   *          precision and total deposit fee value.
   */
  async estimateDepositFee(amount: bigint): Promise<DepositFee> {
    const amountInTokenPrecision = fromSatoshi(amount)

    const { acre: acreFees, tbtc: tbtcFees } =
      await this.#contracts.bitcoinDepositor.calculateDepositFee(
        amountInTokenPrecision,
      )
    const depositFee = await this.#contracts.stBTC.calculateDepositFee(
      amountInTokenPrecision,
    )

    const sumFeesByProtocol = <
      T extends DepositFees["tbtc"] | DepositFees["acre"],
    >(
      fees: T,
    ) => Object.values(fees).reduce((reducer, fee) => reducer + fee, 0n)

    const tbtc = toSatoshi(sumFeesByProtocol(tbtcFees))

    const acre = toSatoshi(sumFeesByProtocol(acreFees)) + toSatoshi(depositFee)

    return {
      tbtc,
      acre,
      total: tbtc + acre,
    }
  }

  /**
   * @returns Minimum deposit amount in 1e8 satoshi precision.
   */
  async minDepositAmount() {
    const value = await this.#contracts.bitcoinDepositor.minDepositAmount()
    return toSatoshi(value)
  }
}

export { StakingModule, StakeInitialization }
