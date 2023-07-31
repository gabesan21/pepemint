import React from "react";
import Beneficios from "./Beneficios";
import Historia from "./Historia";

interface Props {
  userAddress: string | null;
  totalSupply: number;
  maxSupply: number;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  isSoldOut: boolean;
}

interface State {
  selectedTab: string;
}

const defaultState: State = {
  selectedTab: "beneficios",
};

export default class Tabs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;

    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(tabName: string) {
    this.setState({ selectedTab: tabName });
  }

  render() {
    return (
      <>

        <div className="flex justify-between space-x-2">
          <div onClick={() => this.handleTabClick("beneficios")}>
            <img
              src="/images/beneficios.png"
              alt="Benefícios"
              className="cursor-pointer w-3/5 mx-auto"
            />
          </div>
          <div onClick={() => this.handleTabClick("historia")}>
            <img
              src="/images/historia.png"
              alt="História"
              className="cursor-pointer w-3/5 mx-auto"
            />
          </div>
        </div>

        {this.state.selectedTab === "beneficios" && <Beneficios />}
        {this.state.selectedTab === "historia" && <Historia />}
      </>
    );
  }
}
