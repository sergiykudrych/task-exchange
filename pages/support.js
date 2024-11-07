import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import MainContainer from '../components/MainContainer';
import Header from '../components/Home/HeaderMain';

import useFeedbackStore from '../data/stores/UseFeedbackStore';
import useUserStore from '../data/stores/UseUserStore';
const Support = () => {
  const router = useRouter();
  const { feedbackSend } = useFeedbackStore((state) => state);
  const { user, refreshToken } = useUserStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ title: '', message: '', name: '', status: 'Отправлено', image: '' });
  const [messages, setMessages] = useState({
    text: '',
    status: '',
    show: false,
  });
  const [isMounted, setIsMounted] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await feedbackSend({ ...feedback, user: 'anonim ' + feedback.name || '' });
    if (response?.data?.status === 200) {
      setFeedback({
        title: '',
        message: '',
        status: 'Отправлено',
        name: user?.name || '',
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
  const imagebase64 = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const uploadImages = await imagebase64(file);
    setFeedback({ ...feedback, image: uploadImages });
  };

  const handleAuth = async (Token) => {
    try {
      const response = await refreshToken(Token);
      if (response.status === 200) {
        setIsAuth(true);
        router.push('/feedback');
      }
    } catch (error) {
      console.error('Authorization error:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        handleAuth(refreshToken);
      }
    }
  }, [isMounted]);
  return (
    <>
      <MainContainer title={'Служба поддержки'}>
        <Header />

        <div className="feedback">
          <div className="feedback__container">
            <h1 className="feedback__title">
              <img className="feedback__icon" src="/feedback.svg" alt="Служба поддержки" />
              Служба поддержки
            </h1>
            <form onSubmit={handleSubmit} className="feedback__form">
              <label className="feedback__body-label">
                <p>Ваше имя</p>
                <input
                  className="feedback__input"
                  type="text"
                  value={feedback.name}
                  onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                  required
                />
              </label>
              <label className="feedback__body-label">
                <p>Тема обращения</p>
                <input
                  className="feedback__input"
                  type="text"
                  value={feedback.title}
                  onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
                  required
                />
              </label>
              <label className="feedback__body-label">
                <p>Сообщение</p>
                <textarea
                  className="feedback__textarea"
                  type="text"
                  value={feedback.message}
                  required
                  onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                ></textarea>
                <p>Укажите в сообщении способ связи с вами</p>
              </label>
              <label className="feedback__body-label feedback__body-label--image">
                <p>Загрузите изображение</p>
                {feedback?.image ? <img className="feedback__img" src={feedback?.image} alt="" /> : null}
                <input type="file" name="profileImage" accept="image/*" id="fileInput" onChange={handleFileChange} />
              </label>
              <button className="feedback__button button button--full">{loading ? 'Отправка...' : 'Отправить'}</button>
              <div className="feedback-send ">
                <img className="feedback-send__icon" src="/done.svg" alt="" />
                <h3 className="feedback-send__text">Сообщение отправлено</h3>
                <p className="feedback-send__subtitle">В ближайшее время с вами свяжутся</p>
              </div>
            </form>
            <div className={messages.show ? 'message__popup active' : 'message__popup'}>
              <img src={messages.status === 'success' ? '/confirmed.svg' : '/error.svg'} alt="" />
              <p className="message__popup-text">{messages.text}</p>
            </div>
          </div>
        </div>
      </MainContainer>
    </>
  );
};

export default Support;
