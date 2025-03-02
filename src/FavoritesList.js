import React from 'react';

const FavoritesList = ({ favorites }) => {
  return (
    <div className="favorites-list">
      <h2>Favorites</h2>
      <ul>
        {favorites.map((item, index) => (
          <li key={index}>
            <img src={item.primaryImage} alt={item.title} />
            <p>{item.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;
