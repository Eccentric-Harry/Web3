import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Your mnemonic phrase
const mnemonic = "pattern voyage poet eight dish undo jar lottery body balance tool rare";
const derivationPath = "m/44'/501'/0'/1'"; // Second wallet

const main = async () => {
  try {
    // Step 1: Convert mnemonic to seed
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Step 2: Derive the private key using the derivation path
    const derivedSeed = derivePath(derivationPath, seed).key;

    // Step 3: Generate keypair
    const keypair = Keypair.fromSeed(derivedSeed);

    // Step 4: Verify and display results
    console.log("Derived Public Key:", keypair.publicKey.toBase58());

    if (keypair.publicKey.toBase58() === "G1xduUDhxM4hSmxdQBAjYWYHkJes9AXtfkCh1JbnoDsa") {
      console.log("Private Key (Base58):", bs58.encode(keypair.secretKey));
    } else {
      console.log("Public key does not match the desired address.");
    }
  } catch (error) {
    console.error("Error deriving private key:", error.message);
  }
};

main();
