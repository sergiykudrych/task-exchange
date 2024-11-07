import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
const Header = () => {
  const router = useRouter();
  const [burgerIsActive, setBurgerIsActive] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: '744590613939-bv2be68426h2225rm5him1jk95nfnflb.apps.googleusercontent.com',
      callback: handleGoogleSignIn,
      scope: 'profile email',
    });

    window.google.accounts.id.renderButton(document.getElementById('googleSignInButton'), {
      theme: 'filled_black',
      size: 'large',
      type: 'icon',
      shape: 'pill',
      text: 'signin_with',
      logo_alignment: 'left',
      locale: 'en',
    });
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('googleToken') || localStorage.getItem('googleToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ name: payload.name, email: payload.email, picture: payload.picture });
    }
  }, []);
  const handleGoogleSignIn = (response) => {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));

    setUser({ name: payload.name, email: payload.email, picture: payload.picture });

    localStorage.setItem('googleToken', token); // Сохранение токена
    sessionStorage.setItem('googleToken', token);
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('googleToken'); // Удалить токен
    sessionStorage.removeItem('googleToken'); // Удалить токен
  };
  const toggleBurger = () => {
    setBurgerIsActive(!burgerIsActive);
    document.querySelector('body').classList.toggle('_lock');
  };
  return (
    <header className="header header-home">
      <div className="header-home__container">
        <div className="header__logo">
          <Link href="/">
            Task<span>Exchange</span>
          </Link>
        </div>
        <div className="header__menu menu">
          <div className={`menu__icon ${burgerIsActive ? '_active' : ''}`} onClick={() => toggleBurger()}>
            <span></span>
          </div>
          <nav className={`menu__body ${burgerIsActive ? '_active' : ''}`}>
            {/* <ul className="menu__list">
              <li>
                <Link href="/tasks/pages/1">Исполнителю</Link>
              </li>
              <li>
                <Link href="/tasks/pages/1">Закажчику</Link>
              </li>
              <li>
                <Link href="/">О нас</Link>
              </li>
            </ul> */}
            <div className="header__menu__action">
              <h3 className="header__menu__action-title">Исполняйте задания и зарабатывайте реальные деньги</h3>
              <Link href="/login" className="header__menu__action-button button button--border">
                Вход
              </Link>
              <Link href="/register" className="header__menu__action-button button button--full">
                Регистрация
              </Link>

              <p className="header__menu__action-text">или</p>
              <button id="googleSignInButton" className="header__menu__action-button-google"></button>

              {user?.name && (
                <div className="header__menu__action-user">
                  <div className="header__menu__action-user__image"></div>
                  <p className="header__menu__action-user__name">{user.name}</p>
                  <img src={user.picture} alt="" />
                  <button onClick={handleLogout}>Выйти</button>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="header__buttons">
          {router.pathname !== '/login' && (
            <Link href="/login" className="header__menu__action-button button button--border">
              Вход
            </Link>
          )}
          {router.pathname !== '/register' && (
            <Link href="/register" className="header__menu__action-button button button--full">
              Регистрация
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
