export const getFavorites = () => {
  try {
    const items = JSON.parse(localStorage.getItem('favorites') || '[]');
    return Array.isArray(items) ? items.filter(item => item?.primaryImage) : [];
  } catch { return []; }
};
export const saveFavorite = item => {
  const items = getFavorites();
  if (!items.some(existing => existing.primaryImage === item.primaryImage)) items.push(item);
  localStorage.setItem('favorites', JSON.stringify(items));
};
export const clearFavorites = () => localStorage.removeItem('favorites');
