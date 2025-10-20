import { useEffect, useState } from "react";

/**
 * usePokeBatch
 * Carga concurrente de Pokémon y species en un rango [startRef.current, limit),
 * con cancelación mediante AbortController y ordenado por id.
 * Mantiene el comportamiento original de actualizar startRef.current a `limit` en cada efecto.
 */
export default function usePokeBatch({ limit, startRef, urlBase, speciesBase }) {
  const [pokemon, setPokemon] = useState([]);
  const [legendary, setLegendary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset de datos por página (mismo comportamiento que el original)
    setPokemon([]);
    setLegendary([]);
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const { signal } = controller;

    // Captura el inicio y prepara los ids a consultar
    const start = startRef.current;
    const count = Math.max(limit - start, 0);
    const ids = Array.from({ length: count }, (_, i) => start + i);

    // Mantener el side-effect de dejar startRef en `limit`
    startRef.current = limit;

    if (ids.length === 0) {
      setLoading(false);
      return () => controller.abort();
    }

    const pokemonPromises = ids.map((id) =>
      fetch(`${urlBase}${id}`, { signal }).then((res) => res.json())
    );
    const speciesPromises = ids.map((id) =>
      fetch(`${speciesBase}${id}`, { signal }).then((res) => res.json())
    );

    const p1 = Promise.all(pokemonPromises)
      .then((pokemonData) => {
        const sorted = pokemonData.sort((a, b) => a.id - b.id);
        setPokemon(sorted);
      });

    const p2 = Promise.all(speciesPromises)
      .then((speciesData) => {
        const sorted = speciesData.sort((a, b) => a.id - b.id);
        setLegendary(sorted);
      });

    Promise.all([p1, p2])
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setError(err);
        }
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [limit, startRef, urlBase, speciesBase]);

  return { pokemon, legendary, loading, error };
}
