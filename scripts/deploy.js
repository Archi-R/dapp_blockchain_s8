const { getCreateAddress } = require("ethers");
const hre = require("hardhat");
async function main() {
  const Todo = await ethers.getContractFactory("todo");
  const todo = await Todo.deploy("Hello, world!");
  //await greeter.getDeployedCode()
  console.log("Greeter deployed to:", todo.target);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});