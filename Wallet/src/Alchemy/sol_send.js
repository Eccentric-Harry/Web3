// const { Connection, PublicKey, Keypair, Transaction, SystemProgram, clusterApiUrl } = require('@solana/web3.js');
import { Connection } from '@solana/web3.js';
import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';

async function sendSolana(privateKey, recipientAddress, amountInSol) {
  try {
    // Connect to the Solana network
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Recover the sender's wallet Keypair from the private key
    const senderWallet = Keypair.fromSecretKey(Uint8Array.from(privateKey));

    // Create a PublicKey object for the recipient
    const recipientPublicKey = new PublicKey(recipientAddress);

    // Convert the SOL amount to lamports (1 SOL = 1e9 lamports)
    const lamports = amountInSol * 1e9;

    // Create a transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderWallet.publicKey,
        toPubkey: recipientPublicKey,
        lamports,
      })
    );

    // Send the transaction
    const signature = await connection.sendTransaction(transaction, [senderWallet]);

    console.log(`Transaction sent! Signature: ${signature}`);

    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    console.log('Transaction confirmed!');
  } catch (error) {
    console.error('Error sending SOL:', error);
  }
}

// Example usage
const privateKey = [ /* Your private key as a Uint8Array */ ];
const recipientAddress = 'RecipientWalletPublicAddressHere';
sendSolana(privateKey, recipientAddress, 0.1); // Sending 0.1 SOL
