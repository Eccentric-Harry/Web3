import { generateMnemonic } from 'bip39';

function generateMnemonicUtil() {
    const mnemonic = generateMnemonic(); 
    return mnemonic.split(" ");
}

export default generateMnemonicUtil;