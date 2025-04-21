
// src/components/CategoryMenu.js
import React from 'react';
import './CategoryMenu.css';

/**
 * CategoryMenu component to display a menu of artwork categories and subcategories.
 * @param {boolean} hidden - Whether the menu should be hidden (controlled by App.js)
 */
function CategoryMenu({ hidden }) {
  const categories = [
    {
      name: 'Period',
      subcategories: ['Pre-1600', '1600-1800', '1800-1900', '1900-Present'],
    },
    {
      name: 'Movement',
      subcategories: ['Renaissance', 'Baroque', 'Impressionism', 'Modernism'],
    },
    {
      name: 'Museum',
      subcategories: ['Metropolitan', 'Harvard', 'National Museum of Australia'],
    },
  ];

  // Debug rendering and hidden state
  console.log('CategoryMenu rendered, hidden:', hidden);
  console.log('Categories available:', categories);

  const handleSubcategoryClick = (subcategory) => {
    console.log('Selected subcategory:', subcategory);
    // Add logic to filter artworks by subcategory (e.g., update fetchArtwork query)
  };

  return (
    <div className={`category-menu ${hidden ? 'hidden' : 'visible'}`}>
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.name} className="category-item">
            <button className="category-button">{category.name}</button>
            <div className="subcategory-menu">
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  className="subcategory-button"
                  onClick={() => handleSubcategoryClick(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
}

export default CategoryMenu;