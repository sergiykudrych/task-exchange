import React from 'react';
import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import Loading from '../components/Loading';

const messages = ({ user }) => {
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
                        <p className="message__item-time">{message.time}</p>
                        <img
                          src={
                            (message.status === 'error' && '/error.svg') ||
                            (message.status === 'success' && '/done.svg') ||
                            (message.status === 'waiting' && '/message-orange.svg') ||
                            (message.status === 'information' && '/message-orange.svg')
                          }
                          alt=""
                        />
                      </div>
                      <h3 className="message__item-title">{message.title}</h3>

                      <p className="message__item-text" dangerouslySetInnerHTML={{ __html: message.text }}></p>
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
