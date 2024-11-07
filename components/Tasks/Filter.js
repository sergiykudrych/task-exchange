import React, { useEffect, useState } from 'react';
import FilterItem from './FilterItem';
import useCategoryStore from '../../data/stores/UseCategory';

const Filter = ({ setSelectedCategory, selectedCategory, selectedPrice, setSelectedPrice }) => {
  const [isOpened, setIsOpened] = useState(false);
  const { categories, getCategory } = useCategoryStore((state) => state);
  const toggleFilter = (e) => {
    setIsOpened(!isOpened);
    e.preventDefault();
  };
  const clearFilter = () => {
    setSelectedPrice(1);
    setSelectedCategory('all');
  };
  const getCategories = async () => {
    try {
      await getCategory();
    } catch (error) {}
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getCategories();
    }
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <form className={!isOpened ? 'tasks__filter open' : 'tasks__filter'}>
      <button className="tasks__filter-button" onClick={(e) => toggleFilter(e)}>
        Фильтр
      </button>
      <div className="tasks__filter-block tasks__filter-block-category">
        <h3 className="tasks__filter-title">Категории</h3>
        <label htmlFor="all-category" className="tasks__filter-label">
          <p>Всё категории</p>
          <input
            className="tasks__filter-input"
            id="all-category"
            name="category"
            type="radio"
            value="all"
            checked={selectedCategory === 'all'}
            onChange={() => setSelectedCategory('all')}
          />
        </label>
        {categories?.map((category) => (
          <label htmlFor={category.slug} className="tasks__filter-label" key={category.slug}>
            <p>{category.title}</p>
            <input
              className="tasks__filter-input"
              id={category.slug}
              name="category"
              type="radio"
              value={category.slug}
              checked={selectedCategory === category.slug}
              onChange={() => setSelectedCategory(category.slug)}
            />
          </label>
        ))}
      </div>
      <div className="tasks__filter-block">
        <h3 className="tasks__filter-title">Цена</h3>
        <label htmlFor="price-low" className="tasks__filter-label">
          <p>Сначала дешевые</p>
          <input
            className="tasks__filter-input"
            id="price-low"
            name="price"
            type="radio"
            value="low"
            checked={selectedPrice === 1}
            onChange={() => setSelectedPrice(1)}
          />
        </label>
        <label htmlFor="price-high" className="tasks__filter-label">
          <p>Сначала дорогие</p>
          <input
            className="tasks__filter-input"
            id="price-high"
            name="price"
            type="radio"
            value="high"
            checked={selectedPrice === -1}
            onChange={() => setSelectedPrice(-1)}
          />
        </label>
      </div>

      <button className="tasks__filter-reset" type="button" onClick={clearFilter}>
        Сбросить фильтр
      </button>
    </form>
  );
};
export default Filter;
