export const filterBySearchText = (searchValue: string, dataIndex: string): boolean => {
    const regex = new RegExp(searchValue.split('').join('.*?'), 'i');
    return regex.test(dataIndex);
  };