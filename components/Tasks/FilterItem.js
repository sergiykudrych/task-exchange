import React from 'react';

const FilterItem = ({ name, slug }) => {
  return (
    <label htmlFor={slug} className="tasks__filter-label">
      <p>{name}</p>
      <input className="tasks__filter-input" id={slug} type="checkbox" value={slug} />
    </label>
  );
};

export default FilterItem;
