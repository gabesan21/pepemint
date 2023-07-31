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
    price: 10,
    maxMintAmountPerTx: 1,
  },
  preSale: {
    price: 10,
    maxMintAmountPerTx: 1,
  },
  publicSale: {
    price: 10,
    maxMintAmountPerTx: 1,
  },
  contractAddress: "0x8C382E08B01DE80Ef9d2F23a36624e3c4fEa96aB",
  marketplaceIdentifier: 'pepe-holmes-nft',
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
};

export default CollectionConfig;
