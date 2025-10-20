import { useMemo } from "react";

// Encapsula la combinación/filtrado de pokemon con species (legendary/mythical)
// Usa el helper filtereddata existente y devuelve una lista memoizada
export default function useFilteredPokemon(pokemon, legendary, combiner) {
  return useMemo(() => {
    if (typeof combiner === "function") {
      return combiner(pokemon, legendary);
    }
    // Fallback defensivo por si el helper no está disponible
    return Array.isArray(pokemon) ? pokemon : [];
  }, [pokemon, legendary, combiner]);
}
