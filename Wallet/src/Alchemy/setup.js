import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "5lDXioJIdjfP6Zmq3Tm21XsiixvNQq3F",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
export default alchemy;


