export const filterBySearchText = (searchValue: string, dataIndex: string): boolean => {
  if (!searchValue) return true;

  const searchWords = searchValue
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean); // удалим пустые строки

  const target = dataIndex.toLowerCase();

  return searchWords.every(word => target.includes(word));
};