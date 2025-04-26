
import React from 'react';
import './CategoryMenu.css';

/**
 * CategoryMenu component to display a menu of artwork categories and subcategories.
 * @param {boolean} hidden - Whether the menu should be hidden (controlled by App.js)
 * @param {function} onSelectCategory - Callback to handle category and subcategory selection
 */
function CategoryMenu({ hidden, onSelectCategory }) {
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
      name: 'Type',
      subcategories: ['Painting', 'Sculpture', 'Photography'],
    },
    {
      name: 'Museum',
      subcategories: ['Metropolitan', 'Harvard', 'National Museum of Australia'],
    },
  ];

  // Debug rendering and hidden state
  console.log('CategoryMenu rendered, hidden:', hidden);
  console.log('Categories available:', categories);

  const handleSubcategoryClick = (category, subcategory) => {
    console.log('Selected category:', category, 'subcategory:', subcategory);
    onSelectCategory(category.toLowerCase(), subcategory);
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
                  onClick={() => handleSubcategoryClick(category.name, sub)}
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