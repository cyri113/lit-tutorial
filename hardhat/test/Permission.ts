import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("Permission", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [account, resource] = await hre.viem.getWalletClients();

    const contract = await hre.viem.deployContract("Permission");

    const publicClient = await hre.viem.getPublicClient();

    return {
      contract,
      account,
      resource,
      publicClient,
    };
  }

  describe("Set Permission", function () {
    it("Should set the right permission", async function () {
      const { contract, account, resource } = await loadFixture(deployFixture);

      const p0 = await contract.read.getPermission([resource.account.address, account.account.address])
      expect(p0).to.be.false

      await contract.write.setPermission([resource.account.address, account.account.address, true])

      const p1 = await contract.read.getPermission([resource.account.address, account.account.address])
      expect(p1).to.be.true
    });
  });
});
