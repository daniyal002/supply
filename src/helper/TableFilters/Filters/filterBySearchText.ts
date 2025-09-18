export const filterBySearchText = (searchValue: string, dataIndex: string): boolean => {
  if (!searchValue) return true;

  const searchWords = searchValue
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean); // удалим пустые строки

  const target = dataIndex.toLowerCase();

  return searchWords.every(word => target.includes(word));
};

export const matchesSearch = (cell: any, value: string): boolean => {
  if (!value) return true;

  const searchWords = String(value)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const target = String(cell ?? "").toLowerCase();

  return searchWords.every((word) => target.includes(word));
};