import React, { useState, useEffect } from 'react';
import MainContainer from '../components/MainContainer';
import HeaderMain from '../components/Home/HeaderMain';
import Link from 'next/link';
import useUserStore from '../data/stores/UseUserStore';
import { useRouter } from 'next/router';
const Register = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser, loginUserGoogle, sendMessageInTelegram } = useUserStore((state) => state);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorInput, setErrorInput] = useState(false);
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
      scope: 'profile email',
    });

    window.google.accounts.id.renderButton(document.getElementById('googleSignInButtonRegister'), {
      theme: 'filled_black',
      size: 'large',
      type: 'icon',
      shape: 'pill',
      text: 'signin_with',
      logo_alignment: 'left',
      locale: 'en',
    });
  }, []);

  useEffect(() => {
    document.querySelector('body').classList.remove('_lock');
  }, []);
  const handleGoogleSignIn = async (response) => {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));

    const formData = {
      name: payload.name,
      email: payload.email,
      userImage: payload.picture,
      isActivated: payload.email_verified,
      password: '123',
    };
    const res = await loginUserGoogle(formData);

    if (res) {
      router.push('/tasks/pages/1');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validateName = (name) => {
    const regex = /^[a-zA-Z0-9_]*$/; // Дозволяємо порожнє значення
    return regex.test(name);
  };
  const handleChangeName = (e) => {
    e.preventDefault();

    // Оновлюємо стан незалежно від валідації
    setFormData({ ...formData, name: e.target.value });

    // Якщо поле не порожнє, перевіряємо валідацію
    if (e.target.value === '' || validateName(e.target.value)) {
      setErrorInput(false);
      setError('');
    } else {
      setError("Используйте только буквы, цифры и '_'");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await registerUser(formData);

    setLoading(false);
    if (response.status === 200) {
      let title = '<b>Регистрация </b>\n';
      let message = '<b>Пользователь:</b> ' + formData.name + ' <b>создал аккаунт</b>';
      await sendMessageInTelegram(title, message);
      router.push('/tasks/pages/1');
    }
    if (response.status === 400) {
      setError(response.error);
    }
  };
  return (
    <MainContainer title="Регистрация">
      <HeaderMain />
      <section className="auth">
        <div className="auth__container">
          <h1 className="auth__title">Регистрация</h1>

          <form className="auth__form" onSubmit={handleSubmit}>
            <input
              className={errorInput ? ' auth__input error' : 'auth__input'}
              type="text"
              name="name"
              placeholder="Login"
              value={formData.name}
              onChange={handleChangeName}
              required
            />
            <input className="auth__input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input
              className="auth__input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className={'auth__input-message ' + (error ? 'error' : '')}>{error}</span>
            <button className="auth__button button button--full" type="submit" disabled={loading}>
              {loading ? 'Регистрация...' : 'Регистрация'}
            </button>
          </form>
          <div className="auth__links">
            <Link className="auth__link" href="/login">
              Уже есть акаунт? Войдите
            </Link>
            <Link className="auth__link" href="/forgot-password">
              Забыли пароль?
            </Link>
          </div>
          <div className="auth__action">
            <p className="auth__action-text">или</p>
            <div className="auth__action-buttons">
              <button id="googleSignInButtonRegister" className="auth__action-button auth__action-google "></button>
            </div>
          </div>
        </div>
      </section>
    </MainContainer>
  );
};

export default Register;
