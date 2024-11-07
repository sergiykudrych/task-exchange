import React, { useEffect } from 'react';
import Select from 'react-select';
import useCategoryStore from '../../data/stores/UseCategory';

const SelectCustom = ({ setCategory }) => {
  const { categories, getCategory } = useCategoryStore((state) => state);
  const [categoryList, setCategoryList] = React.useState([]);
  const getCategories = async () => {
    try {
      await getCategory();
    } catch (error) {}
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const newCategoryList = categories?.map((category) => ({
      value: category.slug,
      label: category.title,
    }));
    setCategoryList(newCategoryList);
  }, [categories]);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'lightgray' : 'white',
      color: 'black',
      cursor: 'pointer',
    }),
    control: (provided) => ({
      ...provided,
      boxShadow: 'none',
      cursor: 'pointer',
      borderRadius: 10,
    }),
  };
  return <Select options={categoryList} styles={customStyles} onChange={setCategory} instanceId="select-category"></Select>;
};

export default SelectCustom;
