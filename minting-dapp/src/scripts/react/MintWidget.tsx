import { utils, BigNumber } from "ethers";
import React from "react";
import NetworkConfigInterface from "../../../../smart-contract/lib/NetworkConfigInterface";

interface Props {
  networkConfig: NetworkConfigInterface;
  maxSupply: number;
  totalSupply: number;
  tokenPrice: BigNumber;
  maxMintAmountPerTx: number;
  isPaused: boolean;
  loading: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  mintTokens(mintAmount: number): Promise<void>;
  whitelistMintTokens(mintAmount: number): Promise<void>;
}

interface State {
  mintAmount: number;
  showIframe: boolean;
}

const defaultState: State = {
  mintAmount: 1,
  showIframe: false,
};

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
    this.setState((prevState) => ({ showIframe: !prevState.showIframe }));
  }

  private canMint(): boolean {
    return !this.props.isPaused || this.canWhitelistMint();
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private async mint(): Promise<void> {
    if (!this.props.isPaused) {
      await this.props.mintTokens(1);

      return;
    }
  }

  render() {
    return (
      <>
        {this.canMint() ? (
          <>
            <div
              className={`flex items-center justify-center bg-transparent ${
                this.props.loading
                  ? "animate-pulse saturate-0 pointer-events-none"
                  : ""
              }`}
            >
              <button
                className="bg-white text-[#0E2335] text-xl w-3/5 font-atma"
                disabled={this.props.loading}
                onClick={() => this.mint()}
              >
                Mint Nft
              </button>
            </div>
            <div className="flex items-center justify-center bg-transparent">
              <button
                className="bg-[#0E2335] text-white text-xl w-3/5 font-atma"
                disabled={this.props.loading}
                onClick={() => this.handleButtonClick()}
              >
                Sem MATIC? Compre aqui!
              </button>
            </div>
            {this.state.showIframe && (
              <div className="flex items-center justify-center bg-transparent">
                <iframe
                  width="400"
                  height="760"
                  src="https://loopipay.com/crypto/polygon-matic?utm_source=influencers&utm_medium=partnership&utm_campaign=MG45VJ&MG45VJ=1&embedded=1"
                  title="LoopiPay"
                />
              </div>
            )}
          </>
        ) : (
          <div className="cannot-mint">
            <span className="emoji">⏳</span>O contrato está{" "}
            <strong>pausado</strong>.<br />
            Por favor volte mais tarde!
          </div>
        )}
      </>
    );
  }
}
