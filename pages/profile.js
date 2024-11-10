import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import MainContainer from '../components/MainContainer';
import Headers from '../components/Works/Header';
import Loading from '../components/Loading';

// Додаємо назву компонента
const Profile = ({ user }) => {
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  if (!user) return <Loading />;
  return (
    <MainContainer title={user?.name}>
      <Headers />
      <div className="profile">
        <div className="profile__container">
          <div className="profile__container-block">
            <div className="profile__image">
              <img src={user?.userImage || '/icon-user.svg'} alt={user?.name} />
            </div>
            <div className="profile__info">
              <p className="profile__info-nickname">{user?.name}</p>
              <div className="profile__confirmed">
                <img src={user?.isActivated ? '/confirmed.svg' : '/worning.svg'} alt="" />
                <p>Email {user?.isActivated ? 'подтвержден' : 'не подтвержден'}</p>
              </div>

              <p className="profile__info-status">
                <i className="profile__info-status-icon dot-user-online"></i>
                Online
              </p>
              <p className="profile__info-date">На сайте с {user?.createdAt}</p>
              <p className="profile__info-plan">
                Тарифный план: <span>{user?.plan}</span>
              </p>
              <p>Выполненных задач: {user?.completeTasks.length}</p>
              {windowWidth < 1025 && (
                <Link href="/settings" className="profile__button button button--full">
                  <img src="/settings.svg" alt="" />
                  Настройки профиля
                </Link>
              )}
            </div>
          </div>
          <div className="profile__container-block">
            {user?.info.length > 0 ? (
              <div className="profile__info-item">
                {user.info.username && <h1 className="profile__info-item-title">{user.info.username}</h1>}
                {user.info.proffession && <p className="profile__info-item-subtitle">{user.info.proffession}</p>}
                {user.info.aboutMe && <p className="profile__info-item-description">{user.info.aboutMe}</p>}
              </div>
            ) : (
              <h1 className="profile__info-item-subtitle">Пользователь не добавил информацию</h1>
            )}
          </div>
          {windowWidth > 1024 && (
            <div className="profile__container-block">
              <Link href="/settings" className="profile__button button button--full">
                <img src="/settings.svg" alt="" />
                Настройки профиля
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainContainer>
  );
};

export default Profile;
