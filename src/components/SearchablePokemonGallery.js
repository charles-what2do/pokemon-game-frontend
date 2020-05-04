import React from "react";
import axios from "axios";
import SearchHeader from "./SearchHeader";
import PokemonGallery from "./PokemonGallery";
import Loader from "./Loader";
import "./SearchablePokemonGallery.css";
// import pokemonData from "../pokemon/pokemon";
const baseURL = "https://us-central1-pokedex-23fb6.cloudfunctions.net";

class SearchablePokemonGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: "",
      searchPokemonName: "",
      isLoading: true,
      pokemons: [],
    };
  }

  handleInputChange = (event) => {
    this.setState({ inputVal: event.target.value });
  };

  search = () => {
    this.setState({
      searchPokemonName: this.state.inputVal.toLowerCase(),
    });
  };

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };

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

    axios(baseURL + "/app/pokemonData")
      .then((res) => {
        this.setState({
          isLoading: false,
          pokemons: res.data,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false }); //, errorMessage: "Please Try Again" });
      });
  }

  showPokemonGallery() {
    return (
      <div data-testid="pokemon-gallery" className="pokemon-gallery">
        <SearchHeader
          inputVal={this.state.inputVal}
          onTextChange={this.handleInputChange}
          onButtonClick={this.search}
          onhandleKeyDown={this._handleKeyDown}
        />
        <PokemonGallery
          pokemons={this.state.pokemons.filter((pokemon) =>
            pokemon.name.english
              .toLowerCase()
              .includes(this.state.searchPokemonName)
          )}
        />
      </div>
    );
  }

  render() {
    return (
      <div>{this.state.isLoading ? <Loader /> : this.showPokemonGallery()}</div>
    );
  }
}

export default SearchablePokemonGallery;
