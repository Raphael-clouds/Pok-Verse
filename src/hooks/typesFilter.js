/**
 * Filtra una lista normalizada de Pokémon por tipo.
 * Entrada: list (Array), type string ('all' | 'fire' | ...)
 * Salida: lista filtrada. Si type='all', retorna la lista original.
 */
export const filtereddata = (list, type = 'all') => {
	if (!Array.isArray(list)) return [];
	const selected = (type || 'all').toLowerCase();
	if (selected === 'all') return list;
	return list.filter((pk) => getTypeNames(pk).includes(selected));
};

export const filterByType = filtereddata;

function getTypeNames(pokemon) {
	const raw = pokemon?.types ?? pokemon?.type ?? [];
	if (Array.isArray(raw)) {
		return raw
			.map((t) => {
				if (!t) return null;
				if (typeof t === 'string') return t.toLowerCase();
				if (typeof t === 'object') {
					if (t.type && typeof t.type.name === 'string') return t.type.name.toLowerCase();
					if (typeof t.name === 'string') return t.name.toLowerCase();
					if (typeof t.typeName === 'string') return t.typeName.toLowerCase();
				}
				return null;
			})
			.filter(Boolean);
	}
	if (typeof raw === 'string') return [raw.toLowerCase()];
	const collected = [];
	if (typeof pokemon?.primaryType === 'string') collected.push(pokemon.primaryType.toLowerCase());
	if (typeof pokemon?.secondaryType === 'string') collected.push(pokemon.secondaryType.toLowerCase());
	return collected;
}