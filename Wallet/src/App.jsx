import { useState } from "react";
import "./App.css";
import DisplayMnemonic from "./DisplayMenmonic";
import generateMnemonicUtil from "./util/generateMnemonics";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";
import ConfirmationModal from "./ConfirmationModal";

function App() {
  const [mnemonics, setMnemonics] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [solanaAddresses, setSolanaAddresses] = useState([]);
  const [ethAddresses, setEthAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleGenerateMnemonic = () => {
    if (solanaAddresses.length > 0 || ethAddresses.length > 0) {
      setShowModal(true);
    } else {
      const generatedMnemonic = generateMnemonicUtil();
      setMnemonics(generatedMnemonic);
      setIsGenerated(true);
    }
  };

  const handleConfirmGenerateNewMnemonic = () => {
    const generatedMnemonic = generateMnemonicUtil();
    setMnemonics(generatedMnemonic);
    setIsGenerated(true);
    setSolanaAddresses([]);
    setEthAddresses([]);
    setShowModal(false);
  };

  const handleCancelGenerateNewMnemonic = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <h1 className="text-4xl font-bold text-center mb-6">Wallets</h1>

      <DisplayMnemonic
        mnemonics={mnemonics}
        onGenerateMnemonic={handleGenerateMnemonic}
      />

      {isGenerated && (
        <>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Mnemonics</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {mnemonics.map((word, index) => (
                <li
                  key={index}
                  className="bg-gray-800 p-3 rounded-lg text-center text-sm font-medium text-gray-200 shadow-sm hover:shadow-md transition duration-300"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-8">
            <SolanaWallet 
              mnemonic={mnemonics.join(" ")} 
              onAddressGenerated={(address) => {
                setSolanaAddresses((prev) => [...prev, address]);
              }}
            />
            <EthWallet 
              mnemonic={mnemonics.join(" ")} 
              onAddressGenerated={(address) => {
                setEthAddresses((prev) => [...prev, address]);
              }}
            />
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirmGenerateNewMnemonic}
        onCancel={handleCancelGenerateNewMnemonic}
      />
    </div>
  );
}

export default App;
