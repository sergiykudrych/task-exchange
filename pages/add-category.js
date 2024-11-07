import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import useCategoryStore from '../data/stores/UseCategory';
import Loading from '../components/Loading';
import useUserStore from '../data/stores/UseUserStore';
const AddCategory = () => {
  const { addCategory, categories, getCategory, removeCategory } = useCategoryStore((state) => state);

  const { user, refreshToken } = useUserStore((state) => state);
  const router = useRouter();
  const [category, setCategory] = useState({
    value: '',
    label: '',
  });
  const [messages, setMessages] = useState({
    text: '',
    status: '',
    show: false,
  });
  const getCategories = async () => {
    try {
      await getCategory();
    } catch (error) {}
  };
  const createCategory = async (e) => {
    e.preventDefault();
    try {
      setMessages({
        text: 'Добавление категории...',
        status: 'success',
        show: true,
      });
      const responce = await addCategory(category);
      if (responce.status === 200) {
        setMessages({
          text: responce.messages,
          status: 'success',
          show: true,
        });
        setCategory({ value: '', label: '' });
      } else {
        setMessages({
          text: responce.error,
          status: 'error',
          show: true,
        });
      }
      // Таймер очистки сообщения
      setTimeout(() => {
        setMessages({
          text: '',
          status: '',
          show: false,
        });
      }, 2000);
    } catch (e) {}
  };
  const handleAuth = async (Token) => {
    try {
      const responce = await refreshToken(Token);
      if (responce.status === 200) {
        setIsAuth(true);
      } else {
        router.push('/login');
      }
    } catch (error) {}
  };
  const deleteCategory = async (id) => {
    try {
      await removeCategory(id);
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
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        handleAuth(refreshToken);
      } else {
        router.push('/login');
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);
  if (!user) return <Loading />;
  if (user.role !== 'ADMIN') {
    return (
      <MainContainer title={'У вас нет прав для этой страницы'}>
        <Header />
        <Forbidden title={'У вас нет прав для этой страницы'} />
      </MainContainer>
    );
  }
  return (
    <>
      <MainContainer title={'Добавить категорию'}>
        <Header />
        <div className="add-category">
          <div className="add-category__container">
            <h1 className="add-category__title">Добавить категорию</h1>
            <form className="add-category__form" onSubmit={createCategory}>
              <label className="add-category__label">
                <input
                  className="add-category__input"
                  value={category.value}
                  onChange={(e) => setCategory({ ...category, value: e.target.value })}
                  type="text"
                  placeholder="Title категории"
                  required
                />
              </label>
              <label className="add-category__label">
                <input
                  className="add-category__input"
                  value={category.label}
                  onChange={(e) => setCategory({ ...category, label: e.target.value })}
                  type="text"
                  placeholder="Slug категории"
                  required
                />
              </label>
              <button className="add-category__button button button--full">Добавить</button>
            </form>
          </div>
          <br />
          {categories?.length > 0 && (
            <div className="add-category__container">
              {categories?.map((category, index) => (
                <div className="add-category__item" key={category._id}>
                  <span className="add-category__item-index">#{index + 1}</span>
                  <span className="add-category__item-title">{category.title}</span>
                  <span className="add-category__item-slug">{category.slug}</span>
                  <button className="add-category__button-remove button button--red" onClick={() => deleteCategory(category._id)}>
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={messages.show ? 'message__popup active' : 'message__popup'}>
          <img src={messages.status === 'success' ? '/confirmed.svg' : '/error.svg'} alt="" />
          <p className="message__popup-text">{messages.text}</p>
        </div>
      </MainContainer>
    </>
  );
};

export default AddCategory;