import React, { useState, useEffect } from 'react';
import MainContainer from '../../components/MainContainer';
import Headers from '../../components/Works/Header';
import Link from 'next/link';
import axios from 'axios';
import Loading from '../../components/Loading';
import useUserStore from '../../data/stores/UseUserStore';
import { useRouter } from 'next/router';

const User = ({ user }) => {
  const router = useRouter();
  const { refreshToken } = useUserStore((state) => state);
  const [windowWidth, setWindowWidth] = useState(0);
  const [online, setOnline] = useState(true);
  const [lastVisitSite, setLastVisitSite] = useState('');

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  const handlerOnline = () => {
    // Різниця в мілісекундах
    let timeDifference = new Date().getTime() - user?.lastVisit;
    // let timeDifference = new Date().getTime() - 1729485952426;

    // Переведення в хвилини
    let minutes = Math.floor(timeDifference / 1000 / 60);
    let hourse = Math.floor(minutes / 60);
    let days = Math.floor(hourse / 24);
    let lastVisit = '';

    if (minutes > 5) {
      setOnline(false);
      lastVisit = `Был онлайн ${minutes} минут назад`;
      if (minutes > 1 && minutes <= 4) {
        lastVisit = `Был онлайн ${minutes} минуты назад`;
      }
      if (minutes > 4) {
        lastVisit = `Был онлайн ${minutes} минут назад`;
      }
    }
    if (hourse > 0) {
      lastVisit = `Был онлайн ${hourse} час назад`;
      if (hourse > 1 && hourse <= 4) {
        lastVisit = `Был онлайн ${hourse} часа назад`;
      }
      if (hourse > 4) {
        lastVisit = `Был онлайн ${hourse} часов назад`;
      }
    }
    if (days > 0) {
      lastVisit = `Был онлайн ${days} день назад`;
      if (days > 1 && days <= 4) {
        lastVisit = `Был онлайн ${days} дня назад`;
      }
      if (days > 4) {
        lastVisit = `Был онлайн ${days} дней назад`;
      }
    }

    setLastVisitSite(lastVisit);
  };

  useEffect(() => {
    handlerOnline();
  }, [user]);

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

  if (!user) {
    return <Loading />;
  }
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
              <p className="profile__info-status">
                <i className={'profile__info-status-icon' + (online ? ' dot-user-online' : ' dot-user-offline')}></i>
                {online ? 'Онлайн' : lastVisitSite}
              </p>
              <p className="profile__info-date">На сайте с {user?.createdAt}</p>
              <p className="profile__info-plan">
                Тарифный план: <span>{user?.plan}</span>
              </p>
              <p>Выполненных задач: {user?.completeTasks.length}</p>
              {windowWidth < 1025 ||
                (!user?.info?.contacts && (
                  <Link href={user?.info?.contacts} className="profile__button button button--border">
                    Связаться
                  </Link>
                ))}
            </div>
          </div>
          <div className="profile__container-block">
            {user?.info.length > 1 ? (
              <div className="profile__info-item">
                {user.info.userName ? <h1 className="profile__info-item-title">{user.info.userName}</h1> : null}
                {user.info.profession ? <p className="profile__info-item-subtitle">{user.info.profession}</p> : null}
                {user.info.aboutMe ? <p className="profile__info-item-description">{user.info.aboutMe}</p> : null}
              </div>
            ) : (
              <h1 className="profile__info-item-subtitle">Пользователь не добавил информацию</h1>
            )}
          </div>
          {windowWidth > 1024 && user?.info?.contacts && (
            <div className="profile__container-block">
              <Link href={user.info.contacts} target="_blank" className="profile__button button button--border">
                Связаться
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainContainer>
  );
};

export default User;

export async function getServerSideProps({ params }) {
  const { name } = params;
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/${name}`;

    const response = await axios.get(url);

    return {
      props: { user: response.data },
    };
  } catch (error) {
    console.error('Error fetching user:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.response && error.response.status === 404) {
      return { notFound: true }; // Повертає 404 сторінку
    }
    return {
      props: { error: error.message },
    };
  }
}
