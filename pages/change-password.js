import React, { useEffect, useState } from 'react';
import MainContainer from '../components/MainContainer';
import HeaderMain from '../components/Home/HeaderMain';
import useUserStore from '../data/stores/UseUserStore';
import { useRouter } from 'next/router';
import axios from 'axios';
import MessageStatus from '../components/MessageStatus';
const ForgotPassword = () => {
  const router = useRouter();
  const hash = router.asPath.split('?')[1];
  const { updateUserPassword } = useUserStore((state) => state);
  const [inputsNew, setInputsNew] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [password, setPassword] = useState({
    user: '',
    newPassword: '',
    newPasswordRepeat: '',
  });
  const [messages, setMessages] = useState({
    text: '',
    status: '',
    show: false,
  });
  const handleInputChangePassword = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setMessages({
      text: 'Смена пароля...',
      status: 'waiting',
      show: true,
    });
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
    const response = await updateUserPassword({ password, type: 'reset' });

    if (response.status === 400) {
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
      setInputsNew(false);
      setPassword({
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
        router.push('/login');
      }, 500);
    }

    setLoadingPassword(false);
  };
  const handleCheckLink = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/check-password-link', { hash });

      if (response.status === 200) {
        router.replace('/change-password', undefined, { shallow: true });
        setPassword({ ...password, user: response.data.user });
      } else {
        router.push('/login');
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (hash) {
      handleCheckLink();
    }
  }, [hash]);
  return (
    <>
      <MainContainer title="Смена пароля">
        <HeaderMain />
        <section className="auth">
          <div className="auth__container">
            <h1 className="auth__title">Востановление пароля</h1>
            <form onSubmit={handleChangePassword} className="auth__form">
              <label className="auth__label">
                <p className="auth__label-title">Новый пароль</p>
                <input
                  type="password"
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handleInputChangePassword}
                  className={inputsNew ? 'auth__input auth__input-error' : 'auth__input'}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="auth__label">
                <p className="auth__label-title">Повторите новый пароль</p>
                <input
                  type="password"
                  name="newPasswordRepeat"
                  value={password.newPasswordRepeat}
                  onChange={handleInputChangePassword}
                  className={inputsNew ? 'auth__input auth__input-error' : 'auth__input'}
                  autoComplete="new-password"
                  required
                />
              </label>

              <button type="submit" className="auth__button button button--full">
                {loadingPassword ? 'Идет обновление...' : 'Сохранить'}
              </button>
            </form>
          </div>
        </section>
        <MessageStatus show={messages.show} status={messages.status} text={messages.text} />
      </MainContainer>
    </>
  );
};

export default ForgotPassword;
