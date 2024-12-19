import alchemy from "./setup.js";
import { ethers } from "ethers";

async function eth_getBalance(address) {
  try {
    const balance = await alchemy.core.getBalance(address);
    const ethValue = ethers.utils.formatEther(balance); 
    console.log(`Balance for ${address}: ${ethValue} ETH`);
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

// eth_getBalance("0xAcA65a064E50DF66D31390bf5752Fffb0d1F06a0");
export default eth_getBalance;