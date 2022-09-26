const { expect } = require("chai")
// const { ethers } = require("hardhat")
const tokenJSON = require ("../artifacts/contracts/ERC20.sol/PXR3.json")

describe("PShop", function () {
  let owner: { address: any }
  let buyer: { sendTransaction: (arg0: { value: number; to: any }) => any }
  let shop: {
    address: any; deployed: () => any; owner: () => any; token: () => any 
}
  let erc20: { balanceOf: (arg0: any) => any }

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners()

    const MShop = await ethers.getContractFactory("PShop", owner)
    shop = await MShop.deploy()
    await shop.deployed()

    erc20 = new ethers.Contract(await shop.token(), tokenJSON.abi, owner)
  })

  it("Should have an owner and a token", async function () {
    expect(await shop.owner()).to.eq(owner.address)

    expect(await shop.token()).to.be.properAddress
  })

  it("Allows to buy", async function () {
    const tokenAmount = 3

    const txData = {
      value: tokenAmount,
      to: shop.address
    }

    const tx = await buyer.sendTransaction(txData)

    expect (await erc20.balanceOf(buyer.address)).to.eq(tokenAmount)
  })
})