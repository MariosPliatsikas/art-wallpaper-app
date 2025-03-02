
export const saveFavorite = (item) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.push(item);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

export const getFavorites = () => {
  return JSON.parse(localStorage.getItem('favorites')) || [];
};

export const clearFavorites = () => {
  localStorage.removeItem('favorites');
};