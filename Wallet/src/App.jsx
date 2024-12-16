import { useState } from "react";
import "./App.css";
import DisplayMenmonic from "./DisplayMenmonic";
import generateMnemonicUtil from "./util/generateMnemonics";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";

function App() {
  const [mnemonics, setMnemonics] = useState([]);

  const handleGenerateMnemonic = () => {
    const generatedMnemonic = generateMnemonicUtil();
    setMnemonics(generatedMnemonic);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Mnemonics and Wallets</h1>

      <DisplayMenmonic 
        mnemonics={mnemonics} 
        onGenerateMnemonic={handleGenerateMnemonic} 
      />

      <div className="mt-8 space-y-8">
        {mnemonics.length > 0 && (
          <div className="flex flex-col items-center space-y-4">
            <SolanaWallet mnemonic={mnemonics.join(" ")} />
            <EthWallet mnemonic={mnemonics.join(" ")} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
