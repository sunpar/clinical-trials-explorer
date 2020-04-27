export const onlyUnique = (value, index, self): boolean => {
  return self.indexOf(value) === index;
};

export const onlyUniqueObj = (value, index, self, key): boolean => {
  return self.findIndex(item => item[key] === value[key]) === index;
};
