import React, { useRef } from "react";

const Pokepoke = ({ poke }) => {
  const type = useRef("");
  const secondaryType = useRef("");
  const pokeType = poke.types[0];
  const pokeSecondaryType = poke.types[1];

  switch (pokeType) {
    case "grass":
      type.current = "grass";
      break;
    case "fire":
      type.current = "fire";
      break;
    case "water":
      type.current = "water";
      break;
    case "bug":
      type.current = "bug";
      break;
    case "normal":
      type.current = "normal";
      break;
    case "poison":
      type.current = "poison";
      break;
    case "electric":
      type.current = "electric";
      break;
    case "ground":
      type.current = "ground";
      break;
    case "fairy":
      type.current = "fairy";
      break;
    case "fighting":
      type.current = "fighting";
      break;
    case "psychic":
      type.current = "psychic";
      break;
    case "rock":
      type.current = "rock";
      break;
    case "ghost":
      type.current = "ghost";
      break;
    case "ice":
      type.current = "ice";
      break;
    case "dragon":
      type.current = "dragon";
      break;
    case "dark":
      type.current = "dark";
      break;
    case "steel":
      type.current = "steel";
      break;
    case "flying":
      type.current = "flying";
      break;
  }

  switch (pokeSecondaryType) {
    case "grass":
      secondaryType.current = "grass";
      break;
    case "fire":
      secondaryType.current = "fire";
      break;
    case "water":
      secondaryType.current = "water";
      break;
    case "bug":
      secondaryType.current = "bug";
      break;
    case "normal":
      secondaryType.current = "normal";
      break;
    case "poison":
      secondaryType.current = "poison";
      break;
    case "electric":
      secondaryType.current = "electric";
      break;
    case "ground":
      secondaryType.current = "ground";
      break;
    case "fairy":
      secondaryType.current = "fairy";
      break;
    case "fighting":
      secondaryType.current = "fighting";
      break;
    case "psychic":
      secondaryType.current = "psychic";
      break;
    case "rock":
      secondaryType.current = "rock";
      break;
    case "ghost":
      secondaryType.current = "ghost";
      break;
    case "ice":
      secondaryType.current = "ice";
      break;
    case "dragon":
      secondaryType.current = "dragon";
      break;
    case "dark":
      secondaryType.current = "dark";
      break;
    case "steel":
      secondaryType.current = "steel";
      break;
    case "flying":
      secondaryType.current = "flying";
      break;
  }

  return (
    <li
      className={
        poke.isLegend
          ? "poke-item legendary legendary-card pokemon-card"
          : poke.isMythical
          ? "poke-item pokemon-card mythical mythical-card"
          : `poke-item ${type.current} pokemon-card`
      }
    >
      <div className="number-container">
        {poke.isLegend && <small className="legendary-text">Legendario</small>}
        {poke.isMythical && <small className="mythical-text">Mítico</small>}
        <span className="poke-number">
          {poke.id < 10
            ? `N.° 000${poke.id}`
            : poke.id < 100
            ? `N.° 00${poke.id}`
            : `N.° 0${poke.id}`}
        </span>
      </div>
      <h3 className="poke-name">{poke.name}</h3>
      <img className="poke-sprite" src={poke.sprite} alt={poke.name} />
      <div className="features">
        <div>
          <small className={`poke-types ${type.current}`}>{pokeType}</small>
          {pokeSecondaryType && (
            <small className={`poke-types ${secondaryType.current}`}>
              {pokeSecondaryType}
            </small>
          )}
        </div>
        <small className="poke-weight">Peso: {poke.weight}Kg</small>
      </div>
    </li>
  );
};

export default Pokepoke;
