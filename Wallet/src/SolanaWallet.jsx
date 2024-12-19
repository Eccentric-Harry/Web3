import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, PublicKey, clusterApiUrl, SystemProgram, Transaction } from "@solana/web3.js";
import nacl from "tweetnacl";
import { buttonClass, addressBoxClass, containerClass } from "./util/walletStyles";

export function SolanaWallet({ mnemonic, onAddressGenerated }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState({});
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [showSendForm, setShowSendForm] = useState(false); // Control the visibility of input fields

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fetchBalance = async (publicKey) => {
    try {
      const lamports = await connection.getBalance(new PublicKey(publicKey));
      setBalances((prev) => ({ ...prev, [publicKey]: lamports / 1e9 }));
      setErrorMessages((prev) => ({ ...prev, [publicKey]: "" }));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setErrorMessages((prev) => ({ ...prev, [publicKey]: "Error fetching balance" }));
    }
  };

  const sendSol = async (senderKeypair, recipientAddress, amountInSol) => {
    try {
      const senderPublicKey = senderKeypair.publicKey.toBase58();
      const balance = await connection.getBalance(senderKeypair.publicKey);
      const balanceInSol = balance / 1e9;

      if (balanceInSol < amountInSol) {
        setErrorMessages((prev) => ({
          ...prev,
          [senderPublicKey]: "Insufficient balance to complete the transaction.",
        }));
        return;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: amountInSol * 1e9,
        })
      );

      const signature = await connection.sendTransaction(transaction, [senderKeypair]);
      console.log("Transaction sent! Signature:", signature);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed!");
      setErrorMessages((prev) => ({ ...prev, [senderPublicKey]: "" }));
    } catch (error) {
      console.error("Error sending SOL:", error);
      const senderPublicKey = senderKeypair.publicKey.toBase58();
      setErrorMessages((prev) => ({
        ...prev,
        [senderPublicKey]: "An error occurred while sending SOL. Please try again.",
      }));
    }
  };

  return (
    <div className={containerClass}>
<button
  onClick={async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, keypair]);
    onAddressGenerated(keypair.publicKey.toBase58());
  }}
  className={`${buttonClass} my-[24px] mt-0 mb-0 ml-[3px]`} 
>
  Add SOL Wallet
</button>



      {publicKeys.length > 0 && (
        <div className="mt-6 space-y-4">
          {publicKeys.map((keypair, index) => (
            <div key={index} className={addressBoxClass}>
              <span className="block truncate">{`Solana - ${keypair.publicKey.toBase58()}`}</span>
              <div className="flex justify-center space-x-4 mt-4">
                {/* Balance Button */}
                <button
                  onClick={() => fetchBalance(keypair.publicKey)}
                  className="btn btn-primary"
                >
                  Get Balance
                </button>

                {/* Send SOL Button */}
                <button
                  onClick={() => setShowSendForm(!showSendForm)} // Toggle input fields visibility
                  className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                >
                  Send SOL
                </button>
              </div>

              {/* Show Balance with 'SOL' unit */}
              {balances[keypair.publicKey] !== undefined && (
                <p className="mt-2 text-xl font-semibold text-blue-200">
                  Balance: {balances[keypair.publicKey].toFixed(4)} SOL
                </p>
              )}

              {/* Conditional Rendering for Send Form */}
              {showSendForm && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full h-12 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                  <input
                    type="number"
                    placeholder="Amount in SOL"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-12 p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                  <button
                    onClick={() => sendSol(keypair, recipient, amount)}
                    className="w-full h-12 mt-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send
                  </button>
                  {errorMessages[keypair.publicKey.toBase58()] && (
                    <div className="text-red-500 my-2">
                      {errorMessages[keypair.publicKey.toBase58()]}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
