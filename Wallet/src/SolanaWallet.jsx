import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { buttonClass, addressBoxClass, containerClass } from "./util/walletStyles";

export function SolanaWallet({ mnemonic, onAddressGenerated }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  return (
    <div className={containerClass}>
      <button
        onClick={() => {
          const seed = mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);

          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, keypair.publicKey]);
          onAddressGenerated(keypair.publicKey.toBase58());
        }}
        className={buttonClass}
      >
        Add Solana Wallet
      </button>

      {publicKeys.length > 0 && (
        <div className="mt-6 space-y-4">
          {publicKeys.map((publicKey, index) => (
            <div key={index} className={addressBoxClass}>
              <span className="block truncate">{`Solana - ${publicKey.toBase58()}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
