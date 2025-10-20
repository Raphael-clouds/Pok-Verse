// React core hooks
import { useEffect, useState, useCallback, useMemo } from "react";

// Utilidades y componentes de UI
import { filtereddata } from "./hooks/filterData";
import PokeList from "./components/pokeList";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import ButtonsContainer from "./components/ButtonsContainer";
import "./App.css";

// Hooks personalizados
import usePokeBatch from "./hooks/usePokeBatch";
import usePagination from "./hooks/usePagination";
import useFilteredPokemon from "./hooks/useFilteredPokemon";
import { filterByType } from "./hooks/typesFilter";
import usePokeByType from "./hooks/usePokeByType";
import usePokeBySpeciesFlag from "./hooks/usePokeBySpeciesFlag";

const url = "https://pokeapi.co/api/v2/pokemon/";
const legendaryMithical = "https://pokeapi.co/api/v2/pokemon-species/";

function App() {
  // Estado local para mantener datos crudos de la API
  const [pokemon, setPokemon] = useState([]);
  const [legendary, setLegendary] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

  // Paginación: encapsula page, limit y ref de inicio con misma semántica
  const { page, limit, callNumber, loadMore, loadLess, gotoPage } =
    usePagination({
      initialPage: 1,
      pageSize: 12,
      initialStart: 1,
    });

  // Carga y orden con cancelación; mantiene side-effects de callNumber.current
  const {
    pokemon: fetchedPokemon,
    legendary: fetchedLegendary,
    loading: loadingAll,
    error: errorAll,
  } = usePokeBatch({
    limit,
    startRef: callNumber,
    urlBase: url,
    speciesBase: legendaryMithical,
  });

  // Reflejar en los estados locales para no cambiar la API interna
  useEffect(() => {
    // Fuente base: all
    if (selectedType === "all") setPokemon(fetchedPokemon);
  }, [fetchedPokemon, selectedType]);

  useEffect(() => {
    if (selectedType === "all") setLegendary(fetchedLegendary);
  }, [fetchedLegendary, selectedType]);

  // Memoizar la combinación/filtrado (extraído a custom hook)
  // Hooks por tipo específico y por bandera (legendary/mythical)
  const {
    pokemon: typePokemon,
    legendary: typeLegendary,
    loading: loadingType,
    error: errorType,
  } = usePokeByType({
    selectedType,
    page,
    pageSize: 12,
    urlBase: url,
    speciesBase: legendaryMithical,
  });

  const {
    pokemon: flagPokemon,
    legendary: flagLegendary,
    loading: loadingFlag,
    error: errorFlag,
  } = usePokeBySpeciesFlag({
    flag: selectedType === "legendary" || selectedType === "mythical" ? selectedType : null,
    page,
    pageSize: 12,
    urlBase: url,
    speciesBase: legendaryMithical,
  });

  // Determinar fuente activa según selección
  useEffect(() => {
    if (selectedType === "legendary" || selectedType === "mythical") {
      setPokemon(flagPokemon);
      setLegendary(flagLegendary);
    } else if (selectedType !== "all") {
      setPokemon(typePokemon);
      setLegendary(typeLegendary);
    }
  }, [selectedType, typePokemon, typeLegendary, flagPokemon, flagLegendary]);

  const combined = useFilteredPokemon(pokemon, legendary, filtereddata);
  const newPokemon = useMemo(() => {
    return selectedType === "all" ? filterByType(combined, selectedType) : combined;
  }, [combined, selectedType]);

  // Acciones de paginación provienen del hook usePagination

  const handlePoke = useCallback(() => {
    console.log(newPokemon);
  }, [newPokemon]);

  // gotoPage también se extrae en usePagination

  // Render condicional memoizable: muestra estado de carga o error, o la lista
  const renderContent = useCallback(() => {
    const usingFlag = selectedType === "legendary" || selectedType === "mythical";
    const isLoading = selectedType === "all" ? loadingAll : usingFlag ? loadingFlag : loadingType;
    const loadError = selectedType === "all" ? errorAll : usingFlag ? errorFlag : errorType;
    if (isLoading) {
      return <div className="loading">Cargando...</div>;
    }
    if (loadError) {
      return <div className="error">Error al cargar datos.</div>;
    }
    return <PokeList poke={newPokemon} />;
  }, [selectedType, loadingAll, loadingType, loadingFlag, errorAll, errorType, errorFlag, newPokemon]);
  return (
    <>
      {/* Cabecera y navegación principal */}
      <Header />
      <NavBar
        selectedType={selectedType}
        onTypeChange={(value) => {
          setSelectedType(value);
          if (page !== 1) gotoPage(1);
        }}
      />

      {/* Contenido principal: lista de pokémon o estados de carga/error */}
      {renderContent()}

      {/* Controles de paginación y acciones */}
      <ButtonsContainer
        onLoadMore={loadMore}
        onFilter={handlePoke}
        onLoadLess={loadLess}
        page={page}
        onGotoPage={gotoPage}
      />
    </>
  );
}

export default App;
