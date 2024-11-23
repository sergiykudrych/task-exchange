import React, { useState } from 'react';
import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import useUserStore from '../data/stores/UseUserStore';
import Loading from '../components/Loading';
import MessageStatus from '../components/MessageStatus';
const SendMessage = ({ user }) => {
  const { sendMessages } = useUserStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    name: '',
    title: '',
    message: '',
    type: 'information',
  });
  const [messages, setMessages] = useState({
    text: '',
    status: '',
    show: false,
  });
  const handleChange = (e) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessages({
      text: 'Отправка сообщения...',
      status: 'waiting',
      show: true,
    });
    const response = await sendMessages(message);
    if (response?.data?.status === 200) {
      setMessage({
        name: '',
        title: '',
        message: '',
        type: 'information',
      });
    }
    setLoading(false);
    setMessages({
      text: response?.data?.message,
      status: response?.data?.status === 200 ? 'success' : 'error',
      show: true,
    });

    // Таймер очистки сообщения
    setTimeout(() => {
      setMessages({
        text: '',
        status: '',
        show: false,
      });
    }, 2000);
  };

  if (!user) return <Loading />;
  return (
    <>
      <MainContainer title={'Отправить сообщение'}>
        <Header />
        <div className="send-message">
          <div className="send-message__container">
            <h1 className="send-message__title">Отправить сообщение</h1>

            <form className="send-message__form" onSubmit={handleSubmit}>
              <label className="send-message__label">
                <span>Имя получалетя</span>

                <input type="text" className="send-message__input" name="name" value={message.name || ''} onChange={handleChange} required />
              </label>
              <label className="send-message__label">
                <span>Тема сообщения</span>
                <input type="text" className="send-message__input" name="title" value={message.title || ''} onChange={handleChange} required />
              </label>
              <label className="send-message__label">
                <span>Сообщение</span>
                <textarea
                  className="send-message__textarea"
                  name="message"
                  value={message.message || ''}
                  minLength={3}
                  onChange={handleChange}
                ></textarea>
              </label>
              <label className="send-message__label">
                <span>Тип сообщения</span>
                <select name="type" className="send-message__select" onChange={handleChange}>
                  <option value="information">Информационное</option>
                  <option value="error">Ошибка</option>
                  <option value="success">Успешное</option>
                </select>
              </label>
              <button className="send-message__button button--full button">{loading ? 'Отправка...' : 'Отправить'}</button>
            </form>
          </div>
          <MessageStatus show={messages.show} status={messages.status} text={messages.text} />
        </div>
      </MainContainer>
    </>
  );
};

export default SendMessage;
