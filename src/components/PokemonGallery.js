import React from "react";
import PokemonCard from "./PokemonCard";
import "./PokemonGallery.css";

const PokemonGallery = ({ pokemons }) => {
  return (
    <div>
      <div className="pokemon-cards">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default PokemonGallery;
