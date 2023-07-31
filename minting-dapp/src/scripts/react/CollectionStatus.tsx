import React from "react";

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

export default class CollectionStatus extends React.Component<Props, State> {
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
          <div className="w-5/12 bg-[#0E2335] border-4 border-white text-white p-2 text-center text-lg font-atma rounded-lg">
            Explore o fascinante universo do detetive Pepe Holmes em uma jornada
            única que combina a <b>cultura dos memes</b> e o ecossistema crypto.{" "}
            <br />
            <br />3 artes diferentes para você utilizar como banner das redes
            sociais e obter benefícios na Modular.
          </div>
          <div className="w-5/12 bg-[#0E2335] border-4 border-white text-white p-2.5 text-center text-xl font-atma flex flex-col justify-center rounded-lg">
            <p className="mb-2">
              <b>Valor</b>: 10 MATIC
            </p>
            <p className="mb-2">
              <b>Supply</b>: 300
            </p>
            <p>
              <b>Rede</b>: Polygon
            </p>
          </div>
        </div>

        
      </>
    );
  }
}
