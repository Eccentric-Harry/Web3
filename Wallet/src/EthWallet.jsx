import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { ethers } from "ethers"; 
import { buttonClass, addressBoxClass, containerClass } from "./util/walletStyles";

export const EthWallet = ({ mnemonic, onAddressGenerated }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [balances, setBalances] = useState({});
  const [wallets, setWallets] = useState([]); // Store { address, privateKey, recipient, amount, errorMessage } pairs

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

          // setWallets([...wallets, { address: wallet.address, privateKey: wallet.privateKey }]);
          setWallets([...wallets, { 
            address: wallet.address, 
            privateKey: wallet.privateKey, 
            recipient: "", 
            amount: "" ,
            errorMessage: ""
          }]);
          
          // Update state with new address
          setCurrentIndex(currentIndex + 1);
          // setAddresses([...addresses, wallet.address]);
          onAddressGenerated(wallet.address);
        }}
        className={buttonClass}
      >
        Add ETH Wallet
      </button>

      {wallets.length > 0 && (
        <div className="mt-6 space-y-4">
          {wallets.map(({ address, privateKey, recipient, amount }, index) => (
            <div key={index} className={addressBoxClass}>
              <span className="block truncate">{`ETH - ${address}`}</span>
              <button onClick={() => fetchBalance(address)} className="btn btn-primary">
                Get Balance
              </button>
              {balances[address] && <p>Balance: {balances[address]} ETH</p>}
              <div>
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={recipient}
                  onChange={(e) => {
                    const newWallets = [...wallets];
                    newWallets[index].recipient = e.target.value;
                    setWallets(newWallets);
                  }}
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
                />
                <button
                  onClick={() => sendEth(privateKey, recipient, amount, index)}
                  className="btn btn-secondary"
                >
                  Send
                </button>

                {wallets[index].errorMessage && (
                  <div className="text-red-500 my-2">
                    {wallets[index].errorMessage}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
