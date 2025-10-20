import { useEffect, useMemo, useState } from "react";

export default function usePokeByType({ selectedType, page, pageSize, urlBase, speciesBase }) {
  const [allIds, setAllIds] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [legendary, setLegendary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedType || selectedType === "all") {
      setAllIds([]);
      return;
    }

    let aborted = false;
    setError(null);
    setLoading(true);

    fetch(`https://pokeapi.co/api/v2/type/${encodeURIComponent(selectedType)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error al cargar tipo ${selectedType}`);
        return res.json();
      })
      .then((json) => {
        if (aborted) return;
        const ids = (json.pokemon || [])
          .map((p) => extractIdFromUrl(p?.pokemon?.url))
          .filter((n) => Number.isInteger(n))
          .sort((a, b) => a - b);
        setAllIds(ids);
      })
      .catch((err) => {
        if (!aborted) setError(err);
      })
      .finally(() => {
        if (!aborted) setLoading(false);
      });

    return () => {
      aborted = true;
    };
  }, [selectedType]);

  useEffect(() => {
    if (!selectedType || selectedType === "all") return;
    if (allIds.length === 0) {
      setPokemon([]);
      setLegendary([]);
      return;
    }

    const startIdx = (page - 1) * pageSize;
    const ids = allIds.slice(startIdx, startIdx + pageSize);

    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setError(null);

    const pokemonPromises = ids.map((id) =>
      fetch(`${urlBase}${id}`, { signal }).then((res) => res.json())
    );
    const speciesPromises = ids.map((id) =>
      fetch(`${speciesBase}${id}`, { signal }).then((res) => res.json())
    );

    const p1 = Promise.all(pokemonPromises).then((data) => {
      const sorted = data.sort((a, b) => a.id - b.id);
      setPokemon(sorted);
    });
    const p2 = Promise.all(speciesPromises).then((data) => {
      const sorted = data.sort((a, b) => a.id - b.id);
      setLegendary(sorted);
    });

    Promise.all([p1, p2])
      .catch((err) => {
        if (err?.name !== "AbortError") setError(err);
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selectedType, allIds, page, pageSize, urlBase, speciesBase]);

  const total = allIds.length;
  const totalPages = useMemo(() => (pageSize > 0 ? Math.ceil(total / pageSize) : 0), [total, pageSize]);

  return { pokemon, legendary, loading, error, total, totalPages };
}

function extractIdFromUrl(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/\/(?:pokemon)\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : null;
}
