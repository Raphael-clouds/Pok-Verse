import { useEffect, useMemo, useRef, useState } from "react";

const CACHE_FLAG_IDS = {
  legendary: null,
  mythical: null,
};

export default function usePokeBySpeciesFlag({ flag, page, pageSize, urlBase, speciesBase }) {
  const [allIds, setAllIds] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [legendary, setLegendary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  useEffect(() => () => { isMounted.current = false; }, []);

  useEffect(() => {
    if (!flag) return;
    if (flag !== "legendary" && flag !== "mythical") return;

    const cached = CACHE_FLAG_IDS[flag];
    if (Array.isArray(cached) && cached.length > 0) {
      setAllIds(cached);
      return;
    }

    let aborted = false;
    setError(null);
    setLoading(true);

    const listUrl = toSpeciesListUrl(speciesBase);

    fetch(listUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Error al cargar listado de species`);
        return res.json();
      })
      .then(async (json) => {
        if (aborted) return;
        const results = Array.isArray(json.results) ? json.results : [];
        const detailUrls = results.map((r) => r.url).filter(Boolean);

        const limit = 20;
        const filteredIds = await mapFilterWithLimit(detailUrls, limit, async (url) => {
          const data = await fetch(url).then((r) => r.json());
          const match = flag === "legendary" ? data?.is_legendary : data?.is_mythical;
          if (match) {
            const id = extractIdFromUrl(url);
            return Number.isInteger(id) ? id : null;
          }
          return null;
        });

        const ids = filteredIds.filter((x) => Number.isInteger(x)).sort((a, b) => a - b);
        CACHE_FLAG_IDS[flag] = ids;
        if (!aborted && isMounted.current) setAllIds(ids);
      })
      .catch((err) => {
        if (!aborted && isMounted.current) setError(err);
      })
      .finally(() => {
        if (!aborted && isMounted.current) setLoading(false);
      });

    return () => {
      aborted = true;
    };
  }, [flag, speciesBase]);

  useEffect(() => {
    if (flag !== "legendary" && flag !== "mythical") return;
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
      if (isMounted.current) setPokemon(sorted);
    });
    const p2 = Promise.all(speciesPromises).then((data) => {
      const sorted = data.sort((a, b) => a.id - b.id);
      if (isMounted.current) setLegendary(sorted);
    });

    Promise.all([p1, p2])
      .catch((err) => {
        if (err?.name !== "AbortError" && isMounted.current) setError(err);
      })
      .finally(() => {
        if (!signal.aborted && isMounted.current) setLoading(false);
      });

    return () => controller.abort();
  }, [flag, allIds, page, pageSize, urlBase, speciesBase]);

  const total = allIds.length;
  const totalPages = useMemo(() => (pageSize > 0 ? Math.ceil(total / pageSize) : 0), [total, pageSize]);

  return { pokemon, legendary, loading, error, total, totalPages };
}

function extractIdFromUrl(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/\/(?:pokemon-species|pokemon)\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : null;
}

function toSpeciesListUrl(speciesBase) {
  try {
    const base = speciesBase.endsWith("/") ? speciesBase.slice(0, -1) : speciesBase;
    return `${base}?limit=20000`;
  } catch {
    return `https://pokeapi.co/api/v2/pokemon-species?limit=20000`;
  }
}

async function mapFilterWithLimit(items, limit, mapper) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      try {
        const r = await mapper(items[idx]);
        results[idx] = r;
      } catch {
        results[idx] = null;
      }
    }
  }
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, () => worker());
  await Promise.all(workers);
  return results;
}
