import ethers from "ethers"

async function eth_send(senderPrivateKey, recipientAddress, amountInEth) {
  try {
    const provider = new ethers.providers.AlchemyProvider('devnet', '5lDXioJIdjfP6Zmq3Tm21XsiixvNQq3F');
    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    const amountInWei = ethers.utils.parseEther(amountInEth);
    const tx = await wallet.sendTransaction({
      to: recipientAddress,
      value: amountInWei,
    });

    console.log('Transaction sent:', tx.hash);
    await tx.wait();
    console.log('Transaction confirmed:', tx.hash);
  } catch (error) {
    console.error('Error sending Ether:', error);
  }
}

eth_send('0xe8B1dFc655cc9D47BC459588304db254FE401297', '0xa0cB51ad19a58bD4a4F94cbF7A5462303cd618b6', '0.1');

export default eth_send;