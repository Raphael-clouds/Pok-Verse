import React from "react";
import PokeItem from "./pokeItem";
const PokeList = ({ poke }) => {
  return (
    <ul className="poke-list">
      {poke.map((item) => (
        <PokeItem poke={item} key={item.id} />
      ))}
    </ul>
  );
};

export default PokeList;
