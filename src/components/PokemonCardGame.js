import React from "react";
import axios from "axios";
import Loader from "./Loader";
import PokemonCard from "./PokemonCard";
import { dealCards } from "../utils/shuffle";
import "./PokemonCardGame.css";

class PokemonCardGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      headerMessage: "",
      endMessage: "",
      playerName: "",
      player1Cards: [],
      player2Cards: [],
      startTime: null,
      attribute: "",
      showBothCards: false,
    };
  }

  async componentDidMount() {
    await this.getData();
  }

  async getData() {
    this.setState({
      isLoading: true,
    });

    axios({
      method: "get",
      url: process.env.REACT_APP_BACKEND_API + "/",
      withCredentials: true,
    })
      .then((res) => {
        this.setState({
          playerName: res.data.username,
        });
      })
      .catch((error) => {
        // console.log(JSON.stringify(error.response.data));
        console.error(error);
        // this.setState({ isLoading: false }); //, errorMessage: "Please Try Again" });
      });

    axios(process.env.REACT_APP_POKEMON_API + "/app/pokemonData")
      .then((res) => {
        const dealedCards = dealCards(res.data);
        this.setState({
          isLoading: false,
          player1Cards: dealedCards.player1,
          player2Cards: dealedCards.player2,
          headerMessage: this.state.playerName + " starts",
          startTime: new Date(),
        });
      })
      .catch((error) => {
        console.error(error);
        // this.setState({ isLoading: false }); //, errorMessage: "Please Try Again" });
      });
  }

  saveRecord(record) {
    this.setState({
      isLoading: true,
    });

    axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_API + "/records",
      data: record,
      withCredentials: true,
    })
      .then((res) => {
        this.setState({
          isLoading: false,
          headerMessage: `You ${
            record.recordType === "WIN" ? "won" : "lost"
          } the game`,
          endMessage: `Record of [${record.recordTime}s] Saved`,
        });
      })
      .catch((error) => {
        // console.log(JSON.stringify(error.response.data));
        console.error(error);
        // this.setState({ isLoading: false }); //, errorMessage: "Please Try Again" });
      });
  }

  gotoGame = () => {
    this.props.history.push("./game");
  };

  gotoRecords = () => {
    this.props.history.push("./records");
  };

  logoutHandler = () => {
    this.props.setLoggedIn(false);
    this.props.history.push("/login");
  };

  handleLogout = () => {
    this.props.logout(this.logoutHandler, null);
  };

  compareCards = (attribute) => {
    const [player1firstCard, ...player1Reamining] = this.state.player1Cards;
    const [player2firstCard, ...player2Reamining] = this.state.player2Cards;

    // console.log(attribute);
    // console.log("Player: " + player2firstCard.base[attribute]);
    // console.log("Computer: " + player1firstCard.base[attribute]);

    if (
      this.state.player2Cards[0].base[attribute] >
      this.state.player1Cards[0].base[attribute]
    ) {
      if (player1Reamining.length === 0) {
        const endTime = new Date();
        const record = {
          recordType: "WIN",
          recordTime: Math.floor((endTime - this.state.startTime) / 2000),
        };
        this.setState({
          headerMessage: "You won the game",
          showBothCards: true,
        });
        setTimeout(
          function () {
            this.saveRecord(record);
          }.bind(this),
          1000
        );
      } else {
        this.setState({
          headerMessage: "You win, your turn",
          attribute: attribute,
          showBothCards: true,
        });
        setTimeout(
          function () {
            this.setState({
              isLoading: false,
              player2Cards: [
                ...player2Reamining,
                player1firstCard,
                player2firstCard,
              ],
              player1Cards: [...player1Reamining],
              showBothCards: false,
            });
          }.bind(this),
          2000
        );
      }
    } else if (
      this.state.player2Cards[0].base[attribute] <
      this.state.player1Cards[0].base[attribute]
    ) {
      if (player2Reamining.length === 0) {
        const endTime = new Date();
        const record = {
          recordType: "LOSE",
          recordTime: Math.floor((endTime - this.state.startTime) / 1000),
        };
        this.setState({
          headerMessage: "You lost the game",
          showBothCards: true,
        });
        setTimeout(
          function () {
            this.saveRecord(record);
          }.bind(this),
          1000
        );
      } else {
        this.setState({
          headerMessage: "You lose, computer's turn",
          attribute: attribute,
          showBothCards: true,
        });
        setTimeout(
          function () {
            this.setState({
              isLoading: false,
              player2Cards: [...player2Reamining],
              player1Cards: [
                ...player1Reamining,
                player2firstCard,
                player1firstCard,
              ],
            });
          }.bind(this),
          2000
        );
        this.computerTurn();
      }
    } else {
      this.setState({
        headerMessage: "Tie, your turn",
        showBothCards: true,
      });

      setTimeout(
        function () {
          this.setState({
            isLoading: false,
            computerIndex: -1,
            player2Cards: [...player2Reamining, player2firstCard],
            player1Cards: [...player1Reamining, player1firstCard],
            showBothCards: false,
          });
        }.bind(this),
        2000
      );
    }
  };

  handleBaseClick = (attribute) => {
    if (!this.state.isLoading) {
      this.compareCards(attribute);
    }
  };

  // playerTurn() {
  //   setTimeout(
  //     function () {
  //       //Start the timer
  //       this.setState({
  //         showBothCards: false,
  //       });
  //     }.bind(this),
  //     1000
  //   );
  // }

  computerTurn = () => {
    console.log("Computer turn");
    const attributeIndex = Math.floor(Math.random() * 6);
    const attribute = Object.keys(this.state.player1Cards[0].base)[
      attributeIndex
    ];

    setTimeout(
      function () {
        this.setState({
          headerMessage: `Computer selects ${attribute}`,
          attribute: attribute,
        });

        setTimeout(
          function () {
            this.compareCards(attribute);
          }.bind(this),
          2000
        );
      }.bind(this),
      1000
    );
  };

  showEndGame() {
    return (
      <div data-testid="end-card-game" className="end-card-game">
        <h2 className="message">{this.state.headerMessage}</h2>
        <h3 className="end-message">{this.state.endMessage}</h3>
        <div className="end-menu">
          <button onClick={this.gotoGame}>
            <span>Retry Game </span>
          </button>
          <button onClick={this.gotoRecords}>
            <span>View Records </span>
          </button>
          <button onClick={this.handleLogout}>
            <span>Logout </span>
          </button>
        </div>
      </div>
    );
  }

  showBothCards() {
    return (
      <div data-testid="pokemon-card-game" className="pokemon-card-game">
        <h2 className="message">{this.state.headerMessage}</h2>
        <div className="player player1">
          <h1 className="player-name">Computer</h1>
          <PokemonCard
            key={this.state.player1Cards[0].id}
            pokemon={this.state.player1Cards[0]}
            attributeSelected={this.state.attribute}
          />
          <h3 className="player-cards-count">
            Cards on hand: {this.state.player1Cards.length}
          </h3>
        </div>
        <div className="player player2">
          <h1 className="player-name">{this.state.playerName}</h1>
          <PokemonCard
            key={this.state.player2Cards[0].id}
            pokemon={this.state.player2Cards[0]}
            attributeSelected={this.state.attribute}
          />
          <h3 className="player-cards-count">
            Cards on hand: {this.state.player2Cards.length}
          </h3>
        </div>
      </div>
    );
  }

  showOnlyPlayerCard() {
    return (
      <div data-testid="pokemon-card-game" className="pokemon-card-game">
        <h2 className="message">{this.state.headerMessage}</h2>
        <div className="player player1">
          <h1 className="player-name">Computer</h1>
          <div
            className="closed-card"
            style={{
              backgroundImage: `url(${
                process.env.PUBLIC_URL + "pokemon-750.jpg"
              })`,
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
              backgroundSize: "100%",
            }}
          />
          <h3 className="player-cards-count">
            Cards on hand: {this.state.player1Cards.length}
          </h3>
        </div>
        <div className="player player2">
          <h1 className="player-name">{this.state.playerName}</h1>
          <PokemonCard
            key={this.state.player2Cards[0].id}
            pokemon={this.state.player2Cards[0]}
            onBaseClick={this.handleBaseClick}
            attributeSelectable={true}
          />
          <h3 className="player-cards-count">
            Cards on hand: {this.state.player2Cards.length}
          </h3>
        </div>
      </div>
    );
  }

  loadComputerTurn() {
    return (
      <div data-testid="pokemon-card-game" className="pokemon-card-game">
        <h2 className="message">{this.state.headerMessage}</h2>
        <div className="player player1">
          <h1 className="player-name">Computer</h1>
          <PokemonCard
            key={this.state.player1Cards[0].id}
            pokemon={this.state.player1Cards[0]}
            attributeSelected={this.state.attribute}
          />
          <h3 className="player-cards-count">
            Cards on hand: {this.state.player1Cards.length}
          </h3>
        </div>
        <div className="player player2">
          <h1 className="player-name">{this.state.playerName}</h1>
          <PokemonCard
            key={this.state.player2Cards[0].id}
            pokemon={this.state.player2Cards[0]}
          />
          <h3 className="player-cards-count">
            Cards on hand: {this.state.player2Cards.length}
          </h3>
        </div>
      </div>
    );
  }

  loadGame() {
    if (this.state.showBothCards) {
      return this.showBothCards();
    } else {
      // if (this.state.computerIndex === -1) {
      return this.showOnlyPlayerCard();
      // } else {
      //   return this.loadComputerTurn();
      // }
    }
  }

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : this.state.endMessage === "" ? (
          this.loadGame()
        ) : (
          this.showEndGame()
        )}
      </div>
    );
  }
}

export default PokemonCardGame;
