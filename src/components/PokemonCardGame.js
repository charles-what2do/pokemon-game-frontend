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
      playerName: "",
      gameCards: {},
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
        this.setState({
          isLoading: false,
          gameCards: dealCards(res.data),
        });
      })
      .catch((error) => {
        console.error(error);
        // this.setState({ isLoading: false }); //, errorMessage: "Please Try Again" });
      });
  }

  handleBaseClick = (attribute, value) => {
    console.log(attribute, value);
  };

  loadGame() {
    return (
      <div data-testid="pokemon-card-game" className="pokemon-card-game">
        <div className="player player1">
          <h1>Computer</h1>
          <div className="pokemon-cards">
            <PokemonCard
              key={this.state.gameCards.player1[0].id}
              pokemon={this.state.gameCards.player1[0]}
              onBaseClick={this.handleBaseClick}
            />
            {/* {this.state.gameCards.player1[0].map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onBaseClick={this.handleBaseClick}
              />
            ))} */}
          </div>
        </div>
        <div className="player player2">
          <h1>{this.state.playerName}</h1>
          <div className="pokemon-cards">
            <PokemonCard
              key={this.state.gameCards.player2[0].id}
              pokemon={this.state.gameCards.player2[0]}
              onBaseClick={this.handleBaseClick}
            />
            {/* {this.state.gameCards.player2[0].map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))} */}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.state.isLoading ? <Loader /> : this.loadGame()}</div>;
  }
}

export default PokemonCardGame;
