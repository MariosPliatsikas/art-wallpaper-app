import React from 'react';
import { getMuseumOptions } from '../services/museums/museumRegistry';
import './CategoryMenu.css';

function CategoryMenu({ hidden, onSelectCategory }) {
  const museumNames = getMuseumOptions().map(({ name }) => name);

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
      subcategories: museumNames,
    },
  ];

  const handleSubcategoryClick = (category, subcategory) => {
    onSelectCategory(category.toLowerCase(), subcategory);
  };

  return (
    <div className={`category-menu ${hidden ? 'hidden' : 'visible'}`}>
      {categories.map((category) => (
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
      ))}
    </div>
  );
}

export default CategoryMenu;
