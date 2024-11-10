import React, { useState } from 'react';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import Loading from '../components/Loading';

import useFeedbackStore from '../data/stores/UseFeedbackStore';
const Feedback = ({ user }) => {
  const { feedbackSend, getFeedbacks, getFeedbacksAll, feedbacks, changeStatus } = useFeedbackStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ title: '', message: '', name: user?.name || '', status: 'Отправлено', image: '' });
  const [messages, setMessages] = useState({
    text: '',
    status: '',
    show: false,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await feedbackSend({ ...feedback, user: user?.name || '' });
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

  React.useEffect(() => {
    if (user?.role === 'ADMIN') {
      getFeedbacksAll('all');
    } else {
      getFeedbacks(user?.name);
    }
  }, [user]);

  const handleStatus = async (id, status) => {
    const response = await changeStatus(id, status);

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

  if (!user) return <Loading />;
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
                <p>Текст обращения</p>
                <textarea
                  className="feedback__textarea"
                  type="text"
                  value={feedback.message}
                  onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                  required
                ></textarea>
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
          {feedbacks?.length > 0 && (
            <div className="feedback__container">
              <h2 className="feedback__title">Ваши обращения</h2>
              <ul className="feedback__list">
                {feedbacks?.map((feedback) => (
                  <li className="feedback__list-item" key={feedback._id}>
                    <div className="feedback__list-item-top">
                      <span className="feedback__list-item-id">#{feedback.id}</span>
                      {user?.role === 'ADMIN' ? (
                        <select className="feedback__list-item-status" name="status" onChange={(e) => handleStatus(feedback._id, e.target.value)}>
                          <option value={feedback.status}>{feedback.status}</option>
                          {feedback.status !== 'Отправлено' && <option value="Отправлено">Отправлено</option>}
                          {feedback.status !== 'В обработке' && <option value="В обработке">В обработке</option>}
                          {feedback.status !== 'Выполнено' && <option value="Выполнено">Выполнено</option>}
                          {feedback.status !== 'Ошибка' && <option value="Ошибка">Ошибка</option>}
                          {feedback.status !== 'Скрыть' && <option value="hide">Скрыть</option>}
                        </select>
                      ) : (
                        <p className="feedback__list-item-status">{feedback.status}</p>
                      )}
                    </div>
                    {feedback.status === 'hide' ? (
                      <h3 className="feedback__list-item-title">Скрыто</h3>
                    ) : (
                      <>
                        <p className="feedback__list-item-message">{feedback.message}</p>
                        {feedback.image && <img className="feedback__list-item-img" src={feedback.image} alt="" />}
                        <div className="feedback__list-item-bottom">
                          <div>{feedback.user}</div>
                          <div>
                            <p className="feedback__list-item-date">Создано: {feedback.createTime}</p>
                            <p className="feedback__list-item-date">Обновлено: {feedback.updateTime}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </MainContainer>
    </>
  );
};

export default Feedback;
