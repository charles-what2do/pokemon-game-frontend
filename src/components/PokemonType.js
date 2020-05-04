import React from "react";
import "./PokemonType.css";

function PokemonType({ type }) {
  return (
    <span className={`pokemon-type type-` + type.toLowerCase()}>{type}</span>
  );
}

export default PokemonType;
