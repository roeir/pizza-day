export const findById = (id, list) => {
  return list.find(item => {
    return item._id === id;
  });
};

export const toggleUser = (user) => {
  return {
    ...user,
    selected: !user.selected
  }
};

export const updateUser = (list, updated) => {
  const findedIndex = list.findIndex(item => {
    return item._id === updated._id;
  });
  return [
    ...list.slice(0, findedIndex),
    updated,
    ...list.slice(findedIndex + 1)
  ];
};