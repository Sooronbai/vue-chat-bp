export const getFromStorage = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

export const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
