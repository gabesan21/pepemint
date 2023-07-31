import React from "react";
import { ethers, BigNumber } from "ethers";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";
import NftContractType from "../lib/NftContractType";
import CollectionConfig from "../../../../smart-contract/config/CollectionConfig";
import NetworkConfigInterface from "../../../../smart-contract/lib/NetworkConfigInterface";
import CollectionStatus from "./CollectionStatus";
import MintWidget from "./MintWidget";
import Whitelist from "../lib/Whitelist";
import { toast } from "react-toastify";

import Slide from "./Slide";
import Tabs from "./Tabs";

const ContractAbi = require("../../../../smart-contract/artifacts/contracts/" +
  CollectionConfig.contractName +
  ".sol/" +
  CollectionConfig.contractName +
  ".json").abi;

interface Props {}

interface State {
  userAddress: string | null;
  network: ethers.providers.Network | null;
  networkConfig: NetworkConfigInterface;
  totalSupply: number;
  maxSupply: number;
  maxMintAmountPerTx: number;
  tokenPrice: BigNumber;
  isPaused: boolean;
  loading: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  merkleProofManualAddress: string;
  merkleProofManualAddressFeedbackMessage: string | JSX.Element | null;
  errorMessage: string | JSX.Element | null;
}

const defaultState: State = {
  userAddress: null,
  network: null,
  networkConfig: CollectionConfig.mainnet,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigNumber.from(0),
  isPaused: true,
  loading: false,
  isWhitelistMintEnabled: false,
  isUserInWhitelist: false,
  merkleProofManualAddress: "",
  merkleProofManualAddressFeedbackMessage: null,
  errorMessage: null,
};

export default class Dapp extends React.Component<Props, State> {
  provider!: Web3Provider;

  contract!: NftContractType;

  private merkleProofManualAddressInput!: HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount = async () => {
    const browserProvider =
      (await detectEthereumProvider()) as ExternalProvider;

    this.provider = new ethers.providers.Web3Provider(browserProvider);

    this.registerWalletEvents(browserProvider);

    await this.initWallet();
  };

  async mintTokens(amount: number): Promise<void> {
    try {
      this.setState({ loading: true });
      const transaction = await this.contract.mint(amount, {
        value: this.state.tokenPrice.mul(amount),
      });

      toast.info(
        <>
          Transaction sent! Please wait...
          <br />
          <a
            href={this.generateTransactionUrl(transaction.hash)}
            target="_blank"
            rel="noopener"
          >
            View on {this.state.networkConfig.blockExplorer.name}
          </a>
        </>
      );

      const receipt = await transaction.wait();

      toast.success(
        <>
          Success!
          <br />
          <a
            href={this.generateTransactionUrl(receipt.transactionHash)}
            target="_blank"
            rel="noopener"
          >
            View on {this.state.networkConfig.blockExplorer.name}
          </a>
        </>
      );

      this.refreshContractState();
      this.setState({ loading: false });
    } catch (e) {
      this.setError(e);
      this.setState({ loading: false });
    }
  }

  private isWalletConnected(): boolean {
    return this.state.userAddress !== null;
  }

  private isContractReady(): boolean {
    return this.contract !== undefined;
  }

  private isSoldOut(): boolean {
    return (
      this.state.maxSupply !== 0 &&
      this.state.totalSupply >= this.state.maxSupply
    );
  }

  private isNotMainnet(): boolean {
    return (
      this.state.network !== null &&
      this.state.network.chainId !== CollectionConfig.mainnet.chainId
    );
  }

  render() {
    return (
      <>
        <Slide />

        {this.state.errorMessage ? (
          <div className="error">
            <p>{this.state.errorMessage}</p>
            <button onClick={() => this.setError()}>Fechar</button>
          </div>
        ) : null}

        {this.isWalletConnected() ? (
          <>
            {this.isContractReady() ? (
              <>
                <CollectionStatus
                  userAddress={this.state.userAddress}
                  maxSupply={this.state.maxSupply}
                  totalSupply={this.state.totalSupply}
                  isPaused={this.state.isPaused}
                  isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                  isUserInWhitelist={this.state.isUserInWhitelist}
                  isSoldOut={this.isSoldOut()}
                />
                {!this.isSoldOut() ? (
                  <MintWidget
                    networkConfig={this.state.networkConfig}
                    maxSupply={this.state.maxSupply}
                    totalSupply={this.state.totalSupply}
                    tokenPrice={this.state.tokenPrice}
                    maxMintAmountPerTx={this.state.maxMintAmountPerTx}
                    isPaused={this.state.isPaused}
                    isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                    isUserInWhitelist={this.state.isUserInWhitelist}
                    mintTokens={(mintAmount) => this.mintTokens(mintAmount)}
                    whitelistMintTokens={(mintAmount) =>
                      this.mintTokens(mintAmount)
                    }
                    loading={this.state.loading}
                  />
                ) : (
                  <div className="collection-sold-out">
                    <h2>
                      Todos os NFTs <strong>foram mintados</strong>!{" "}
                      <span className="emoji">🥳</span>
                    </h2>
                    Você ainda pode comprá-los dos nossos holders aqui:{" "}
                    <a href={this.generateMarketplaceUrl()} target="_blank">
                      {CollectionConfig.marketplaceConfig.name}
                    </a>
                    .
                  </div>
                )}
                <Tabs
                  userAddress={this.state.userAddress}
                  maxSupply={this.state.maxSupply}
                  totalSupply={this.state.totalSupply}
                  isPaused={this.state.isPaused}
                  isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                  isUserInWhitelist={this.state.isUserInWhitelist}
                  isSoldOut={this.isSoldOut()}
                />
              </>
            ) : (
              <div className="collection-not-ready">
                <svg
                  className="spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Buscando coleção...
              </div>
            )}
          </>
        ) : (
          <div className="no-wallet">
            {!this.isWalletConnected() ? (
              <button
                className="primary"
                disabled={this.provider === undefined}
                onClick={() => this.connectWallet()}
              >
                Conectar Carteira
              </button>
            ) : null}
          </div>
        )}
      </>
    );
  }

  private setError(error: any = null): void {
    let errorMessage = "Erro desconhecido...";

    if (null === error || typeof error === "string") {
      errorMessage = error;
    } else if (typeof error === "object") {
      // Support any type of error from the Web3 Provider...
      if (error?.error?.message !== undefined) {
        errorMessage = error.error.message;
      } else if (error?.data?.message !== undefined) {
        errorMessage = error.data.message;
      } else if (error?.message !== undefined) {
        errorMessage = error.message;
      } else if (React.isValidElement(error)) {
        this.setState({ errorMessage: error });

        return;
      }
    }

    this.setState({
      errorMessage:
        null === errorMessage
          ? null
          : errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
    });
  }

  private generateContractUrl(): string {
    return this.state.networkConfig.blockExplorer.generateContractUrl(
      CollectionConfig.contractAddress!
    );
  }

  private generateMarketplaceUrl(): string {
    return CollectionConfig.marketplaceConfig.generateCollectionUrl(
      CollectionConfig.marketplaceIdentifier,
      !this.isNotMainnet()
    );
  }

  private generateTransactionUrl(transactionHash: string): string {
    return this.state.networkConfig.blockExplorer.generateTransactionUrl(
      transactionHash
    );
  }

  private async connectWallet(): Promise<void> {
    try {
      await this.provider.provider.request!({ method: "eth_requestAccounts" });

      this.initWallet();
    } catch (e) {
      this.setError(e);
    }
  }

  private async refreshContractState(): Promise<void> {
    this.setState({
      maxSupply: (await this.contract.maxSupply()).toNumber(),
      totalSupply: (await this.contract.totalSupply()).toNumber(),
      maxMintAmountPerTx: (await this.contract.maxMintAmountPerTx()).toNumber(),
      tokenPrice: await this.contract.cost(),
      isPaused: await this.contract.paused(),
      isWhitelistMintEnabled: await this.contract.whitelistMintEnabled(),
      isUserInWhitelist: Whitelist.contains(this.state.userAddress ?? ""),
    });
  }

  private async initWallet(): Promise<void> {
    const walletAccounts = await this.provider.listAccounts();

    this.setState(defaultState);

    if (walletAccounts.length === 0) {
      return;
    }

    const network = await this.provider.getNetwork();
    let networkConfig: NetworkConfigInterface;

    if (network.chainId === CollectionConfig.mainnet.chainId) {
      networkConfig = CollectionConfig.mainnet;
    } else if (network.chainId === CollectionConfig.testnet.chainId) {
      networkConfig = CollectionConfig.testnet;
    } else {
      this.setError(
        "Rede não suportada! Por favor, conecte-se à rede Polygon."
      );

      return;
    }

    this.setState({
      userAddress: walletAccounts[0],
      network,
      networkConfig,
    });

    if (
      (await this.provider.getCode(CollectionConfig.contractAddress!)) === "0x"
    ) {
      this.setError(
        "Não encontramos o contrato da coleção! Por favor, verifique se você está conectado à rede Polygon e tente novamente."
      );

      return;
    }

    this.contract = new ethers.Contract(
      CollectionConfig.contractAddress!,
      ContractAbi,
      this.provider.getSigner()
    ) as NftContractType;

    this.refreshContractState();
  }

  private registerWalletEvents(browserProvider: ExternalProvider): void {
    // @ts-ignore
    browserProvider.on("accountsChanged", () => {
      this.initWallet();
    });

    // @ts-ignore
    browserProvider.on("chainChanged", () => {
      window.location.reload();
    });
  }
}
