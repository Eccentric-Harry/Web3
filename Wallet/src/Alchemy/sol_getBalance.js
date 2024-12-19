// const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
import { Connection } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';


async function sol_getBalance(walletAddress) {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const publicKey = new PublicKey(walletAddress);

    const balance = await connection.getBalance(publicKey);

    console.log(`Balance for ${walletAddress}: ${balance / 1e9} SOL`);
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}


sol_getBalance('7q6PYSw2dCYfw74igJtDB4iodhCrGBvUg78TnScK6kZj');

export default sol_getBalance;