import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { MaxUint256 } from "ethers"
import { helpers } from "hardhat"

import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { deployment } from "./helpers/context"

import type { StBTC as stBTC, Dispatcher, TestERC20 } from "../typechain"

const { getNamedSigners } = helpers.signers

async function fixture() {
  const { tbtc, stbtc, dispatcher } = await deployment()
  const { governance, maintainer, treasury } = await getNamedSigners()

  return { stbtc, dispatcher, tbtc, governance, maintainer, treasury }
}

describe("Deployment", () => {
  let stbtc: stBTC
  let dispatcher: Dispatcher
  let tbtc: TestERC20
  let maintainer: HardhatEthersSigner
  let treasury: HardhatEthersSigner

  before(async () => {
    ;({ stbtc, dispatcher, tbtc, maintainer, treasury } =
      await loadFixture(fixture))
  })

  describe("Acre", () => {
    describe("constructor", () => {
      context("when treasury has been set", () => {
        it("should be set to a treasury address", async () => {
          const actualTreasury = await stbtc.treasury()

          expect(actualTreasury).to.be.equal(await treasury.getAddress())
        })
      })
    })

    describe("updateDispatcher", () => {
      context("when a dispatcher has been set", () => {
        it("should be set to a dispatcher address by the deployment script", async () => {
          const actualDispatcher = await stbtc.dispatcher()

          expect(actualDispatcher).to.be.equal(await dispatcher.getAddress())
        })

        it("should approve max amount for the dispatcher", async () => {
          const actualDispatcher = await stbtc.dispatcher()
          const allowance = await tbtc.allowance(
            await stbtc.getAddress(),
            actualDispatcher,
          )

          expect(allowance).to.be.equal(MaxUint256)
        })
      })
    })
  })

  describe("Dispatcher", () => {
    describe("updateMaintainer", () => {
      context("when a new maintainer has been set", () => {
        it("should be set to a new maintainer address", async () => {
          const actualMaintainer = await dispatcher.maintainer()

          expect(actualMaintainer).to.be.equal(await maintainer.getAddress())
        })
      })
    })
  })
})
