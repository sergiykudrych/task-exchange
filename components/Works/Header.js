import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeaderLinks from './HeaderLinks';
import HeaderMessages from './HeaderMessages';
import useUserStore from '../../data/stores/UseUserStore';
import { useRouter } from 'next/router';
const Header = () => {
  const [burgerIsActive, setBurgerIsActive] = useState(false);
  const [menuUserIsActive, setMenuUserIsActive] = useState(false);
  const [messageIsActive, setMessageIsActive] = useState(false);
  const [messagesLength, setMessagesLength] = useState(0);
  const router = useRouter();
  const { user, logoutUser, refreshToken } = useUserStore((state) => state);

  const toggleBurger = () => {
    setBurgerIsActive(!burgerIsActive);
    setMenuUserIsActive(false);
    setMessageIsActive(false);
    document.querySelector('body').classList.toggle('_lock');
  };
  const toggleMenuUser = () => {
    setMenuUserIsActive(!menuUserIsActive);
    setMessageIsActive(false);
  };
  const toggleMessageUser = () => {
    setMessageIsActive(!messageIsActive);
    setMenuUserIsActive(false);
  };

  return (
    <header className="header header-work">
      <div className="header-work__container">
        <div className="header__logo">
          <Link href="/tasks/pages/1">
            Task<span>Exchange</span>
          </Link>
        </div>
        {/* <div className="header__menu menu">
          <div className={`menu__icon ${burgerIsActive ? '_active' : ''}`} onClick={() => toggleBurger()}>
            <span></span>
          </div>
          <nav className={`menu__body ${burgerIsActive ? '_active' : ''}`}>
            <ul className="menu__list">
              <li>
                <Link href="/tasks/pages/1">Задания</Link>
              </li>
              <li>
                <Link className="menu__link-button" href="/create-task">
                  Создать задание
                </Link>
              </li>
            </ul>
          </nav>
        </div> */}
        <div className="header__action">
          <Link href="/profile" className="profile__user-info-balance">
            Баланс: {user?.balance}$
          </Link>
          <div className="header__message">
            <button className="header__message-icon" onClick={() => toggleMessageUser()}>
              <img src="/message.svg" width={30} height={30} alt="" />
              {user?.messages.length > 0 && <span className="header__message-icon-count">{user?.messages.length}</span>}
            </button>
            <div className={`header__message-menu message-menu ${messageIsActive ? '_active' : ''}`}>
              {user?.messages.length > 0 ? (
                <>
                  <HeaderMessages messages={user.messages} />
                  <Link href="/messages" className="message-menu__link">
                    Все сообщения &nbsp;→
                  </Link>
                </>
              ) : (
                <div className="message-menu__empty">Нет сообщений</div>
              )}
            </div>
          </div>
          <div className="header__profile">
            <button className="header__profile-icon" onClick={() => toggleMenuUser()}>
              <img src={user?.userImage || '/header/profile.svg'} width={30} height={30} alt="" />
            </button>
            <div className={`header__profile-menu profile-menu ${menuUserIsActive ? '_active' : ''}`}>
              <div className="profile-menu__user">
                <img src={user?.userImage || '/header/profile.svg'} width={30} height={30} loading="lazy" alt="User" />
                <div className="profile-menu__user-info profile__user-info">
                  <p className="profile__user-info-name">{user?.info?.userName || user?.name}</p>
                  <p className="profile__user-info-plan">{user?.plan}</p>
                </div>
              </div>
              <hr />
              <HeaderLinks logoutUser={logoutUser} user={user} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
