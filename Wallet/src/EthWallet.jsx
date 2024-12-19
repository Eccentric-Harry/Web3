import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { ethers } from "ethers"; 
import { buttonClass, addressBoxClass, containerClass } from "./util/walletStyles";

export const EthWallet = ({ mnemonic, onAddressGenerated }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [balances, setBalances] = useState({});
  const [wallets, setWallets] = useState([]); // Store wallet information

  const provider = new ethers.providers.AlchemyProvider("mainnet", "5lDXioJIdjfP6Zmq3Tm21XsiixvNQq3F");

  const fetchBalance = async (address) => {
    try {
      const balance = await provider.getBalance(address);
      setBalances((prev) => ({ ...prev, [address]: ethers.utils.formatEther(balance) }));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const sendEth = async (privateKey, recipientAddress, amountInEth, walletIndex) => {
    try {
      const wallet = new ethers.Wallet(privateKey, provider);
      const balance = await provider.getBalance(wallet.address);
      const balanceInEth = ethers.utils.formatEther(balance);
  
      if (parseFloat(balanceInEth) < parseFloat(amountInEth)) {
        const newWallets = [...wallets];
        newWallets[walletIndex].errorMessage = "Insufficient balance to complete this transaction.";
        setWallets(newWallets);
        return;
      }
  
      const tx = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(amountInEth),
      });
  
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed:", tx.hash);
  
      const newWallets = [...wallets];
      newWallets[walletIndex].errorMessage = "";
      setWallets(newWallets);
    } catch (error) {
      console.error("Error sending ETH:", error);
      const newWallets = [...wallets];
      newWallets[walletIndex].errorMessage = "An error occurred while sending ETH. Please try again.";
      setWallets(newWallets);
    }
  };

  return (
    <div className={containerClass}>
      <button
  onClick={async () => {
    const seed = await mnemonicToSeed(mnemonic);

    // Use ethers.js HDNode for deriving keys
    const hdNode = ethers.utils.HDNode.fromSeed(seed);
    
    // Derive address based on derivation path
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const childNode = hdNode.derivePath(derivationPath);

    // Create wallet using derived private key
    const wallet = new ethers.Wallet(childNode.privateKey);

    setWallets([...wallets, { 
      address: wallet.address, 
      privateKey: wallet.privateKey, 
      recipient: "", 
      amount: "",
      errorMessage: "",
      showInputs: false // Initially, inputs are hidden
    }]);
    
    setCurrentIndex(currentIndex + 1);
    onAddressGenerated(wallet.address);
  }}
  className={buttonClass} // Added my-2 for vertical margin
>
  Add ETH Wallet
</button>


      {wallets.length > 0 && (
        <div className="mt-6 space-y-4">
          {wallets.map(({ address, privateKey, recipient, amount, showInputs }, index) => (
            <div key={index} className={addressBoxClass}>
              <span className="block truncate">{`Ethereum - ${address}`}</span>
              <div className="flex justify-center space-x-4 mt-4">
                <button onClick={() => fetchBalance(address)} className="btn btn-primary">
                  Get Balance
                </button>


                <button
                  onClick={() => {
                    const newWallets = [...wallets];
                    newWallets[index].showInputs = !newWallets[index].showInputs; // Toggle visibility
                    setWallets(newWallets);
                  }}
                  className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                >
                  {showInputs ? "Cancel" : "Send ETH"}
                </button>
              </div>

              {/* Show Balance with 'ETH' unit */}
              {balances[address] && (
                <p className="mt-2 text-xl font-semibold text-blue-200">
                  Balance: {balances[address]} ETH
                </p>
              )}

              {/* Conditional Rendering for Send Form */}
              {showInputs && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => {
                      const newWallets = [...wallets];
                      newWallets[index].recipient = e.target.value;
                      setWallets(newWallets);
                    }}
                    className="w-full h-12 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                  <input
                    type="number"
                    placeholder="Amount in ETH"
                    value={amount}
                    onChange={(e) => {
                      const newWallets = [...wallets];
                      newWallets[index].amount = e.target.value;
                      setWallets(newWallets);
                    }}
                    className="w-full h-12 p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                  <button
                    onClick={() => sendEth(privateKey, recipient, amount, index)}
                    className="w-full h-12 mt-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send
                  </button>

                  {wallets[index].errorMessage && (
                    <div className="text-red-500 my-2">
                      {wallets[index].errorMessage}
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
};
