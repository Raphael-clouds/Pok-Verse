import React from "react";
import "./NavBar.css";

const NavBar = ({ selectedType = "all", onTypeChange }) => {
  const handleChange = (e) => {
    const value = (e.target.value || "all").toLowerCase();
    if (typeof onTypeChange === "function") onTypeChange(value);
  };

  return (
    <nav>
      <div className="filter">
        <label htmlFor="type-select">Filter by Type</label>
        <select name="type" id="type-select" value={selectedType} onChange={handleChange}>
          <option className="all" value="all">All</option>
          <option className="fire" value="fire">Fire</option>
          <option className="water" value="water">Water</option>
          <option className="grass" value="grass">Grass</option>
          <option className="electric" value="electric">Electric</option>
          <option className="psychic" value="psychic">Psychic</option>
          <option className="ice" value="ice">Ice</option>
          <option className="bug" value="bug">Bug</option>
          <option className="rock" value="rock">Rock</option>
          <option className="ground" value="ground">Ground</option>
          <option className="flying" value="flying">Flying</option>
          <option className="poison" value="poison">Poison</option>
          <option className="steel" value="steel">Steel</option>
          <option className="fairy" value="fairy">Fairy</option>
          <option className="fighting" value="fighting">Fighting</option>
          <option className="normal" value="normal">Normal</option>
          <option className="ghost" value="ghost">Ghost</option>
          <option className="dark" value="dark">Dark</option>
          <option className="dragon" value="dragon">Dragon</option>
        </select>
      </div>
    </nav>
  );
};

export default NavBar;
