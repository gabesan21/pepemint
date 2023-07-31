import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import * as Networks from '../lib/Networks';
import * as Marketplaces from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: Networks.polygonTestnet,
  mainnet: Networks.polygonMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: 'PepeHolmesNFT',
  tokenName: 'Pepe Holmes',
  tokenSymbol: 'PPH',
  hiddenMetadataUri: 'ipfs://bafybeiajcupar3sawf242livfgtnqgigfuwsl7dwg7brokn7hj5dnxjkme/1.json',
  maxSupply: 300,
  whitelistSale: {
    price: 0.05,
    maxMintAmountPerTx: 1,
  },
  preSale: {
    price: 0.1,
    maxMintAmountPerTx: 1,
  },
  publicSale: {
    price: 10,
    maxMintAmountPerTx: 1,
  },
  contractAddress: "0x6292320da1d6F6D85F4D7c20aA97b5990E3b9b0c",
  marketplaceIdentifier: 'pepe-holmes-nft',
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
};

export default CollectionConfig;
