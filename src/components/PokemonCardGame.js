import React from "react";
import axios from "axios";
import Loader from "./Loader";
import PokemonCard from "./PokemonCard";
import { dealCards } from "../utils/shuffle";
import "./PokemonCardGame.css";

const pokemonURL = "https://us-central1-pokedex-23fb6.cloudfunctions.net";
const baseURL = "http://localhost:3001/user";

class PokemonCardGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      headerMessage: "",
      subMessage: "",
      playerName: "",
      player1Cards: [],
      player2Cards: [],
      startTime: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({
      isLoading: true,
    });

    axios({
      method: "get",
      url: baseURL + "/",
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

    axios(pokemonURL + "/app/pokemonData")
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
      url: baseURL + "/records",
      data: record,
      withCredentials: true,
    })
      .then((res) => {
        this.setState({
          isLoading: false,
          headerMessage: `You ${
            record.recordType === "WIN" ? "won" : "lost"
          } the game`,
          subMessage: `Record [${record.recordType} of ${record.recordTime}s] Saved`,
        });
      })
      .catch((error) => {
        // console.log(JSON.stringify(error.response.data));
        console.error(error);
        // this.setState({ isLoading: false }); //, errorMessage: "Please Try Again" });
      });
  }

  gotoRecords = () => {
    this.props.history.push("./records");
  };

  gotoGame = () => {
    this.props.history.push("./game");
  };

  handleLogout() {
    // setError(null);
    axios({
      method: "post",
      url: baseURL + "/logout",
    })
      .then((response) => {
        this.props.history.push("/login");
      })
      .catch((error) => {
        if (!!error.response) {
          if (error.response.status === 400) {
            console.log(error.response.data);
            // setError(JSON.stringify(error.response.data));
          } else {
            // setError("Something went wrong. Please try again later.");
          }
        } else {
          // setError("Something went wrong. Please try again later.");
        }
      });
  }

  handleBaseClick = (attribute, value) => {
    if (!this.state.isLoading) {
      const [player1firstCard, ...player1Reamining] = this.state.player1Cards;
      const [player2firstCard, ...player2Reamining] = this.state.player2Cards;
      if (value > this.state.player1Cards[0].base[attribute]) {
        // alert("You win");
        this.setState({ headerMessage: "You win, your turn" });
        if (player1Reamining.length === 0) {
          // alert("You won the game");
          const endTime = new Date();
          const record = {
            recordType: "WIN",
            recordTime: Math.floor((endTime - this.state.startTime) / 1000),
          };
          this.saveRecord(record);
        } else {
          this.setState({
            isLoading: false,
            player2Cards: [
              ...player2Reamining,
              player1firstCard,
              player2firstCard,
            ],
            player1Cards: [...player1Reamining],
          });
        }
      } else {
        // alert("You lose");
        this.setState({ headerMessage: "You lose, computer's turn" });
        if (player2Reamining.length === 0) {
          // alert("You lost the game");
          const endTime = new Date();
          const record = {
            recordType: "LOSE",
            recordTime: Math.floor((endTime - this.state.startTime) / 1000),
          };
          this.saveRecord(record);
        } else {
          this.setState({
            isLoading: false,
            player2Cards: [...player2Reamining],
            player1Cards: [
              ...player1Reamining,
              player2firstCard,
              player1firstCard,
            ],
          });
        }
      }
    }
  };

  showEndGame() {
    return (
      <div data-testid="pokemon-card-game" className="pokemon-card-game">
        <h2 className="message">{this.state.headerMessage}</h2>
        <h3 className="sub-message">
          Here is the sub message: {this.state.subMessage}
        </h3>
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

  loadGame() {
    return (
      <div data-testid="pokemon-card-game" className="pokemon-card-game">
        <h2 className="message">{this.state.headerMessage}</h2>
        <div className="player player1">
          <h1>Computer</h1>
          <PokemonCard
            key={this.state.player1Cards[0].id}
            pokemon={this.state.player1Cards[0]}
            onBaseClick={this.handleBaseClick}
          />
          <h3>Cards on hand: {this.state.player1Cards.length}</h3>
        </div>
        <div className="player player2">
          <h1>{this.state.playerName}</h1>
          <PokemonCard
            key={this.state.player2Cards[0].id}
            pokemon={this.state.player2Cards[0]}
            onBaseClick={this.handleBaseClick}
          />
          <h3>Cards on hand: {this.state.player2Cards.length}</h3>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : this.state.subMessage === "" ? (
          this.loadGame()
        ) : (
          this.showEndGame()
        )}
      </div>
    );
  }
}

export default PokemonCardGame;
