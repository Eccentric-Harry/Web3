import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <button
        onClick={function () {
          const seed = mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, keypair.publicKey]);
        }}
        className="w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
      >
        Add Solana wallet
      </button>

      {publicKeys.length > 0 && (
        <div className="mt-6 space-y-4">
          {publicKeys.map((publicKey, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-sm text-center text-sm font-medium text-gray-700 hover:shadow-md transition duration-300"
            >
              <span className="block truncate">{`Solana - ${publicKey.toBase58()}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
