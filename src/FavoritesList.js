import React from 'react';

const FavoritesList = ({ favorites, onSelectFavorite, onClearFavorites }) => {
  return (
    <div className="favorites-list">
      <h2>Favorites</h2>
      <button className="clear-favorites-button" onClick={onClearFavorites}>Clear Favorites</button>
      <ul>
        {favorites.map((item, index) => (
          <li key={index} onClick={() => onSelectFavorite(item)}>
            <img src={item.primaryImage} alt={item.title} />
            <p>{item.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;