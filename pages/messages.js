import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import Loading from '../components/Loading';

import useUserStore from '../data/stores/UseUserStore';
const messages = () => {
  const router = useRouter();
  const { user, refreshToken } = useUserStore((state) => state);
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

  if (!user) return <Loading />;
  return (
    <>
      <MainContainer title="Сообщения">
        <Header />
        <div className="message">
          <div className="message__container">
            {user?.messages.length > 0 ? (
              <>
                <h1 className="message__title">Всего сообщений: {user?.messages.length}</h1>
                <ul className="message__list">
                  {user?.messages.map((message, index) => (
                    <li className="message__item" key={index}>
                      <div className="message__item-top">
                        <img
                          src={
                            (message.status === 'error' && '/error.svg') ||
                            (message.status === 'success' && '/done.svg') ||
                            (message.status === 'waiting' && '/message-orange.svg') ||
                            (message.status === 'information' && '/message-orange.svg')
                          }
                          alt=""
                        />
                        <h3 className="message__item-title">{message.title}</h3>
                        <p className="message__item-time">{message.time}</p>
                      </div>

                      <p className="message__item-text">{message.text}</p>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h1 className="message__title">Нет сообщений</h1>
            )}
          </div>
        </div>
      </MainContainer>
    </>
  );
};

export default messages;
