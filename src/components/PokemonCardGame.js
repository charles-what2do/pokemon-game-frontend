import React from "react";
import axios from "axios";
import Loader from "./Loader";
import PokemonCard from "./PokemonCard";
import { dealCards } from "../utils/shuffle";
import "./PokemonCardGame.css";
// import pokemonData from "../pokemon/pokemon";
const pokemonURL = "https://us-central1-pokedex-23fb6.cloudfunctions.net";
const baseURL = "http://localhost:3001/user";

class PokemonCardGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      message: "",
      playerName: "",
      player1Cards: [],
      player2Cards: [],
      startTime: null,
      record: {},
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    // this.setState({
    //   isLoading: false,
    //   pokemons: pokemonData,
    // });
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
          message: this.state.playerName + " starts",
          startTime: new Date(),
        });
      })
      .catch((error) => {
        console.error(error);
        // this.setState({ isLoading: false }); //, errorMessage: "Please Try Again" });
      });
  }

  handleBaseClick = (attribute, value) => {
    if (!this.state.isLoading) {
      const [player1firstCard, ...player1Reamining] = this.state.player1Cards;
      const [player2firstCard, ...player2Reamining] = this.state.player2Cards;
      if (value > this.state.player1Cards[0].base[attribute]) {
        // alert("You win");
        this.setState({ message: "You win, your turn" });
        if (player1Reamining.length === 0) {
          // alert("You won the game");
          const endTime = new Date();
          const record = {
            recordType: "WIN",
            recordTime: Math.abs((endTime - this.state.startTime) / 1000),
          };
          this.setState({ message: "You won the game", record: record });
          console.log(record);
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
        this.setState({ message: "You lose, computer's turn" });
        if (player2Reamining.length === 0) {
          // alert("You lost the game");
          const endTime = new Date();
          const record = {
            recordType: "LOSE",
            recordTime: Math.abs((endTime - this.state.startTime) / 1000),
          };
          this.setState({ message: "You lost the game", record: record });
          console.log(record);
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

  loadGame() {
    return (
      <div data-testid="pokemon-card-game" className="pokemon-card-game">
        <h2 className="message">{this.state.message}</h2>
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
    return <div>{this.state.isLoading ? <Loader /> : this.loadGame()}</div>;
  }
}

export default PokemonCardGame;
