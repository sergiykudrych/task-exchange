import React from 'react';

import TopExecutorItem from './TopExecutorItem';
import TopExecutorListSkileton from './TopExecutorListSkileton';

import useTopExecutorStore from '../../data/stores/UseTopExecutorStore';
import useUserStore from '../../data/stores/UseUserStore';
import MessageStatus from '../MessageStatus';

const TopExecutorList = () => {
  const user = useUserStore((state) => state.user);
  const { getTopExecutor, topExecutor, addTopExecutor } = useTopExecutorStore();
  const [showAddTopExecutor, setShowAddTopExecutor] = React.useState(false);
  const [topExecutorInfo, setTopExecutorInfo] = React.useState({
    name: '',
    profession: '',
    contacts: '',
    about: '',
    site: '',
  });
  const [messages, setMessages] = React.useState({
    text: '',
    status: '',
    show: false,
  });
  React.useEffect(() => {
    setTopExecutorInfo({
      name: user?.name,
      profession: user?.info?.profession,
      contacts: user?.info?.contacts,
      image: user?.userImage,
      about: user?.info?.aboutMe,
      site: user?.website,
    });
  }, [user]);
  React.useEffect(() => {
    async function fetchTopExecutors() {
      try {
        await getTopExecutor(); // Виконуємо запит до API
      } catch (error) {
        console.error(error);
      }
    }
    fetchTopExecutors(); // Викликаємо функцію один раз
  }, []);
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
    setTopExecutorInfo({ ...topExecutorInfo, image: uploadImages });
  };
  const addInTopExecutor = async (e) => {
    e.preventDefault();
    if (user?.balance < 4.99) {
      setMessages({
        text: 'Недостаточно средств',
        status: 'error',
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
    } else {
      try {
        setMessages({
          text: 'Загрузка...',
          status: 'waiting',
          show: true,
        });
        const response = await addTopExecutor(topExecutorInfo);
        setMessages({
          text: response?.messages,
          status: response?.status === 200 ? 'success' : 'error',
          show: true,
        });

        // Таймер очистки сообщения
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleShowAddTopExecutor = () => {
    setShowAddTopExecutor(!showAddTopExecutor);
    document.querySelector('body').classList.toggle('_lock');
  };

  if (!topExecutor) {
    return <TopExecutorListSkileton />;
  }
  return (
    <>
      <ul className="top-executor__list">
        <button onClick={handleShowAddTopExecutor} className="top-executor__add">
          <img src="/plus.svg" alt="" />
          <p>Хочу быть здесь</p>
        </button>

        {topExecutor?.map((user) => (
          <TopExecutorItem key={user?._id} user={user} />
        ))}
      </ul>
      {showAddTopExecutor && (
        <div className="top-executor__popup">
          <div className="top-executor__content">
            <h2 className="top-executor__title" style={{ textAlign: 'center' }}>
              Хочу быть в Топ
            </h2>
            <form onSubmit={addInTopExecutor} className="top-executor__form">
              <div className="top-executor__image">
                <img className="top-executor__img" src={topExecutorInfo.image ? topExecutorInfo.image : '/icon-user.svg'} alt="" />
                <br />
                <br />
                <input type="file" name="profileImage" accept="image/*" id="fileInput" onChange={handleFileChange} />
              </div>
              <label htmlFor="" className="top-executor__label">
                <input
                  value={topExecutorInfo.name || ''}
                  onChange={(e) => setTopExecutorInfo({ ...topExecutorInfo, name: e.target.value })}
                  required
                  className="top-executor__input"
                  type="text"
                  placeholder="Ваше имя"
                />
              </label>
              <label htmlFor="" className="top-executor__label">
                <input
                  value={topExecutorInfo.profession || ''}
                  onChange={(e) => setTopExecutorInfo({ ...topExecutorInfo, profession: e.target.value })}
                  required
                  className="top-executor__input"
                  type="text"
                  placeholder="Ваша профессия"
                />
              </label>
              <label htmlFor="" className="top-executor__label">
                <input
                  value={topExecutorInfo.contacts || ''}
                  onChange={(e) => setTopExecutorInfo({ ...topExecutorInfo, contacts: e.target.value })}
                  required
                  className="top-executor__input"
                  type="text"
                  placeholder="Связь с вами"
                />
              </label>
              <label htmlFor="" className="top-executor__label">
                <textarea
                  value={topExecutorInfo.about || ''}
                  onChange={(e) => setTopExecutorInfo({ ...topExecutorInfo, about: e.target.value })}
                  required
                  className="top-executor__textarea"
                  type="text"
                  placeholder="О вас"
                  maxLength={100}
                ></textarea>
                <p>Максимум 100 символов</p>
              </label>
              <label htmlFor="" className="top-executor__label">
                <input
                  value={topExecutorInfo.site || ''}
                  onChange={(e) => setTopExecutorInfo({ ...topExecutorInfo, site: e.target.value })}
                  className="top-executor__input"
                  type="text"
                  placeholder="Ваш сайт"
                />
              </label>
              <div className="change-plan__price">
                <p className="change-plan__price-new">
                  <span>$4.99</span>/месяц
                </p>
              </div>
              <div className="top-executor__buttons">
                <button type="submit" className="top-executor__button button button--full">
                  Оплатить
                </button>
                <button onClick={handleShowAddTopExecutor} type="submit" className="top-executor__button button button--red">
                  Отмена
                </button>
              </div>
            </form>
          </div>
          <MessageStatus show={messages.show} status={messages.status} text={messages.text} />
        </div>
      )}
    </>
  );
};

export default TopExecutorList;
