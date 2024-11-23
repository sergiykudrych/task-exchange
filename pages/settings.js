import React, { useState, useEffect } from 'react';
import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import useUserStore from '../data/stores/UseUserStore';
import Loading from '../components/Loading';
import { useRouter } from 'next/router';
import MessageStatus from '../components/MessageStatus';
const Settings = ({ user }) => {
  const { updateUser, updateUserPassword, activateUser } = useUserStore((state) => state);
  const [errorInputName, setErrorInputName] = useState(false);
  const [inputsNew, setInputsNew] = useState(false);
  const [inputOld, setInputOld] = useState(false);
  const [errorName, setErrorName] = useState('');
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingActiveted, setLoadingActiveted] = useState(false);
  const [timer, setTimer] = useState(5);
  const [messages, setMessages] = useState({
    text: '',
    status: '',
    show: false,
  });
  const [password, setPassword] = useState({
    user: '',
    oldPassword: '',
    newPassword: '',
    newPasswordRepeat: '',
  });
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    userImage: '',
    website: '',
    info: {
      aboutMe: '',
      profession: '',
      userName: '',
      contacts: '',
    },
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || '',
        email: user.email || '',
        userImage: user.userImage || '',
        website: user.website || '',
        info: {
          aboutMe: user.info?.aboutMe || '',
          profession: user.info?.profession || '',
          userName: user.info?.userName || '',
          contacts: user.info?.contacts || '',
        },
      });
      setPassword({
        user: user.name || '',
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prevUser) => {
      if (name in prevUser.info) {
        return {
          ...prevUser,
          info: {
            ...prevUser.info,
            [name]: value,
          },
        };
      }
      return {
        ...prevUser,
        [name]: value,
      };
    });
  };
  const validateName = (name) => {
    const regex = /^[a-zA-Z0-9_]*$/; // Дозволяємо порожнє значення
    return regex.test(name);
  };
  const handleChangeName = (e) => {
    e.preventDefault();
    setUserInfo({ ...userInfo, name: e.target.value });

    // Якщо поле не порожнє, перевіряємо валідацію
    if (e.target.value === '' || validateName(e.target.value)) {
      setErrorInputName(false);
      setErrorName('');
    } else {
      setErrorInputName(true);
      setErrorName("Используйте только буквы, цифры и '_'");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    setMessages({
      text: 'Данные обновляются...',
      status: 'waiting',
      show: true,
    });
    // return;
    const response = await updateUser(userInfo);
    if (response.status === 200) {
      setMessages({
        text: 'Данные успешно обновлены',
        status: 'success',
        show: true,
      });
      setTimeout(() => {
        setMessages({
          text: '',
          status: '',
          show: false,
        });
      }, 2000);
    }
    if (response.status === 400) {
      setMessages({
        text: 'Не удалось обновить данные',
        status: 'error',
        show: true,
      });
      setTimeout(() => {
        setMessages({
          text: '',
          status: '',
          show: false,
        });
      }, 2000);
    }

    setLoadingInfo(false);
  };
  const handleInputChangePassword = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    if (password.newPassword.length < 3) {
      setMessages({
        text: 'Минимальная длина пароля 3 символа',
        status: 'error',
        show: true,
      });
      setTimeout(() => {
        setMessages({
          text: '',
          status: '',
          show: false,
        });
      }, 2000);

      setLoadingPassword(false);
      return;
    }
    if (password.newPassword !== password.newPasswordRepeat) {
      setInputsNew(true);
      setMessages({
        text: 'Пароли не совпадают',
        status: 'error',
        show: true,
      });
      setTimeout(() => {
        setMessages({
          text: '',
          status: '',
          show: false,
        });
      }, 2000);

      setLoadingPassword(false);
      return;
    }

    const response = await updateUserPassword(password);

    if (response.status === 400) {
      setInputOld(true);
      setMessages({
        text: 'Не удалось обновить пароль',
        status: 'error',
        show: true,
      });
      setTimeout(() => {
        setMessages({
          text: '',
          status: '',
          show: false,
        });
      }, 2000);
    }
    if (response.status === 200) {
      setInputOld(false);
      setInputsNew(false);
      setPassword({
        user: user.name || '',
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
      });
      setMessages({
        text: 'Пароль успешно обновлен',
        status: 'success',
        show: true,
      });
      setTimeout(() => {
        setMessages({
          text: '',
          status: '',
          show: false,
        });
      }, 2000);
    }

    setLoadingPassword(false);
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
    setUserInfo({ ...userInfo, userImage: uploadImages });
  };
  const handleActiveted = async () => {
    setTimer(45);

    try {
      const response = await activateUser(user.name);
      if (response?.data?.status === 200) {
        setLoadingActiveted(true);
        const timerInterval = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer === 1) {
              clearInterval(timerInterval);
              setLoadingActiveted(false);
              return 0;
            }
            return prevTimer - 1;
          });
        }, 1000);

        setMessages({
          text: response?.data?.messages,
          status: 'success',
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
      }
    } catch (error) {
      // Обработка ошибки
      setMessages({
        text: 'Ошибка активации',
        status: 'error',
        show: true,
      });
    }
  };
  console.log(user);
  if (!user) return <Loading />;
  return (
    <MainContainer title="Настройки">
      <Header />
      <div className="settings">
        {user ? (
          <>
            <div className="settings__container">
              <h1 className="settings__title">Настройки</h1>
              {!user.isActivated && (
                <div className="settings__activeted">
                  <p className="settings__activeted-text">
                    Ваша почта не активирована, для того чтобы начать работу нужно для начала активировать вашу почту
                  </p>
                  <button disabled={loadingActiveted} className="settings__activeted-button" onClick={handleActiveted}>
                    Активировать
                  </button>
                  {loadingActiveted && <span className="settings__activeted-timer">Отправить ещё через: {timer} сек.</span>}
                </div>
              )}

              <form onSubmit={handleSubmit} className="settings__form">
                <label className="settings__label">
                  <img className="settings__label-img" src={userInfo?.userImage || '/icon-user.svg'} alt="User icon" />
                  <input type="file" name="profileImage" accept="image/*" id="fileInput" onChange={handleFileChange} />
                </label>

                <label className="settings__label">
                  <p className="settings__label-title">Логин</p>
                  <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleChangeName}
                    className={errorInputName ? 'settings__label-input settings__label-input-error' : 'settings__label-input'}
                  />
                  {errorName && <p className="settings__label-error">{errorName}</p>}
                </label>
                <label className="settings__label">
                  <p className="settings__label-title">Имя</p>
                  <input type="text" name="userName" value={userInfo.info.userName} onChange={handleInputChange} className="settings__label-input" />
                </label>

                <label className="settings__label">
                  <p className="settings__label-title">Email</p>
                  <input type="email" name="email" value={userInfo.email} onChange={handleInputChange} className="settings__label-input" />
                </label>

                <label className="settings__label">
                  <p className="settings__label-title">Вы по специальности</p>
                  <input
                    type="text"
                    name="profession"
                    value={userInfo.info.profession}
                    onChange={handleInputChange}
                    className="settings__label-input"
                  />
                </label>

                <label className="settings__label">
                  <p className="settings__label-title">Контакт для связи</p>
                  <input type="text" name="contacts" value={userInfo.info.contacts} onChange={handleInputChange} className="settings__label-input" />
                </label>
                <label className="settings__label">
                  <p className="settings__label-title">Веб-сайт</p>
                  <input type="text" name="website" value={userInfo.website} onChange={handleInputChange} className="settings__label-input" />
                </label>

                <label className="settings__label">
                  <p className="settings__label-title">Информация о вас</p>
                  <textarea name="aboutMe" value={userInfo.info.aboutMe} onChange={handleInputChange} className="settings__label-textarea" rows="5" />
                </label>
                <div className="container__button">
                  <button type="submit" className="settings__button button button--full">
                    {loadingInfo ? 'Идет обновление...' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
            <br />
            {!user.loginGoogle && (
              <div className="settings__container">
                <h2 className="settings__title">Смена пароля</h2>
                <form onSubmit={handleChangePassword} className="settings__form">
                  <label className="settings__label">
                    <p className="settings__label-title">Старый пароль</p>
                    <input
                      type="password"
                      name="oldPassword"
                      value={password.oldPassword}
                      onChange={handleInputChangePassword}
                      className={inputOld ? 'settings__label-input settings__label-input-error' : 'settings__label-input'}
                      autoComplete="current-password"
                      required
                    />
                  </label>
                  <label className="settings__label">
                    <p className="settings__label-title">Новый пароль</p>
                    <input
                      type="password"
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handleInputChangePassword}
                      className={inputsNew ? 'settings__label-input settings__label-input-error' : 'settings__label-input'}
                      autoComplete="new-password"
                      required
                    />
                  </label>
                  <label className="settings__label">
                    <p className="settings__label-title">Повторите новый пароль</p>
                    <input
                      type="password"
                      name="newPasswordRepeat"
                      value={password.newPasswordRepeat}
                      onChange={handleInputChangePassword}
                      className={inputsNew ? 'settings__label-input settings__label-input-error' : 'settings__label-input'}
                      autoComplete="new-password"
                      required
                    />
                  </label>

                  <div className="container__button">
                    <button type="submit" className="settings__button button button--full">
                      {loadingPassword ? 'Идет обновление...' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="settings__container">
            <h1 className="settings__title" style={{ textAlign: 'center' }}>
              Загрузка...
            </h1>
          </div>
        )}
        <MessageStatus show={messages.show} status={messages.status} text={messages.text} />
      </div>
    </MainContainer>
  );
};

export default Settings;
