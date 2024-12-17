import { generateMnemonic } from 'bip39';

function generateMnemonicUtil() {
    const mnemonic = generateMnemonic(); 
    console.log(mnemonic);
    return mnemonic.split(" ");
}

export default generateMnemonicUtil;