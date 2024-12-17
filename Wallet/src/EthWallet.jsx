import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { buttonClass, addressBoxClass, containerClass } from "./walletStyles";

export const EthWallet = ({ mnemonic, onAddressGenerated }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  return (
    <div className={containerClass}>
      <button
        onClick={async () => {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const wallet = new Wallet(child.privateKey);

          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);
          onAddressGenerated(wallet.address);
        }}
        className={buttonClass}
      >
        Add ETH Wallet
      </button>

      {addresses.length > 0 && (
        <div className="mt-6 space-y-4">
          {addresses.map((address, index) => (
            <div key={index} className={addressBoxClass}>
              <span className="block truncate">{`ETH - ${address}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
