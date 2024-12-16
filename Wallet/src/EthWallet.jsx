import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <button
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const privateKey = child.privateKey;
          const wallet = new Wallet(privateKey);
          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);
        }}
        className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        Add ETH wallet
      </button>

      {addresses.length > 0 && (
        <div className="mt-6 space-y-4">
          {addresses.map((address, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-sm text-center text-sm font-medium text-gray-700 hover:shadow-md transition duration-300"
            >
              <span className="block truncate">{`ETH - ${address}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
