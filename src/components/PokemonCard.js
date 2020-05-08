import React from "react";
import "./PokemonCard.css";
import PokemonType from "./PokemonType";

const PokemonCard = ({
  pokemon,
  onBaseClick = () => {},
  attributeSelectable = false,
  attributeSelected = -1,
}) => {
  const { id, name, type, base } = pokemon;
  return (
    <div data-testid="pokemon" className="pokemon-card" z-index={id}>
      <div data-testid="pokemon-name" className="pokemon-name">
        {name.english}
      </div>
      <div data-testid="pokemon-image" className="pokemon-img-block">
        <img
          className="pokemon-img"
          src={process.env.PUBLIC_URL + "/pokemonImage/" + id + ".png"}
          alt={name.english}
        />
      </div>
      <div data-testid="pokemon-type" className="pokemon-types">
        {type.map((curType) => (
          <PokemonType key={curType} type={curType} />
        ))}
      </div>
      <div data-testid="pokemon-type" className="pokemon-base">
        {Object.keys(base).map((attribute) => (
          <span
            key={attribute}
            className={`base-attribute base-${attribute.toLowerCase()}${
              attributeSelectable ? " selectable" : ""
            }${attribute === attributeSelected ? " selected" : ""}`}
            onClick={() => onBaseClick(attribute)}
          >
            {attribute}: {base[attribute]}
          </span>
        ))}
        {/* {displayBaseAttributes(base)} */}
      </div>
    </div>
  );
};

export default PokemonCard;
