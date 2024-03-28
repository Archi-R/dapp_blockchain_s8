//const { getCreateAddress, ethers} = require("ethers");
const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const Todo = await hre.ethers.getContractFactory("todo");
  const todo = await Todo.deploy();
  console.log("Todo deployed to:", todo.target);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
