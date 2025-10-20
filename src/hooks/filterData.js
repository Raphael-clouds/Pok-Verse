export const filtereddata = (data, legendary) => {
  const newData = [];
  for(let i = 0; i < data.length; i++) {
    newData.push({
      id: data[i].id,
      name: data[i].name,
      sprite: data[i].sprites.front_default,
      types: data[i].types.map((type) => type.type.name),
      weight: data[i].weight,
      isLegend: legendary[i]?.is_legendary,
      isMythical: legendary[i]?.is_mythical,
    });
  }

  return newData;}