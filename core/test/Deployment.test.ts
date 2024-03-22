import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { MaxUint256 } from "ethers"
import { helpers } from "hardhat"

import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { deployment } from "./helpers/context"

import type { StBTC as stBTC, TestERC20, MezoAllocator } from "../typechain"

const { getNamedSigners } = helpers.signers

async function fixture() {
  const { tbtc, stbtc, mezoAllocator } = await deployment()
  const { governance, maintainer, treasury } = await getNamedSigners()

  return { stbtc, mezoAllocator, tbtc, governance, maintainer, treasury }
}

describe("Deployment", () => {
  let stbtc: stBTC
  let mezoAllocator: MezoAllocator
  let tbtc: TestERC20
  let maintainer: HardhatEthersSigner
  let treasury: HardhatEthersSigner

  before(async () => {
    ;({ stbtc, mezoAllocator, tbtc, maintainer, treasury } =
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

          expect(actualDispatcher).to.be.equal(await mezoAllocator.getAddress())
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

  describe("MezoAllocator", () => {
    describe("updateMaintainer", () => {
      context("when a new maintainer has been set", () => {
        it("should be set to a new maintainer address", async () => {
          const actualMaintainer = await mezoAllocator.maintainer()

          expect(actualMaintainer).to.be.equal(await maintainer.getAddress())
        })
      })
    })

    describe("updateTbtcStorage", () => {
      context("when a new stBTC address has been set", () => {
        it("should be set to a new stBTC address by the deployment script", async () => {
          const actualTbtcStorage = await mezoAllocator.tbtcStorage()

          expect(actualTbtcStorage).to.be.equal(await stbtc.getAddress())
        })
      })
    })
  })
})
