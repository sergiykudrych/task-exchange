import React, { useState, useEffect } from 'react';
import MainContainer from '../components/MainContainer';
import HeaderMain from '../components/Home/HeaderMain';
import Link from 'next/link';
import useUserStore from '../data/stores/UseUserStore';
import { useRouter } from 'next/router';
const Login = () => {
  const router = useRouter();
  const { loginUser, loginUserGoogle } = useUserStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
      scope: 'profile email',
    });

    window.google.accounts.id.renderButton(document.getElementById('googleSignInButtonLogin'), {
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
    const token = sessionStorage.getItem('googleToken') || localStorage.getItem('googleToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ name: payload.name, email: payload.email, picture: payload.picture });
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await loginUser(formData);
    setLoading(false);
    if (response.status === 200) {
      router.push('/tasks/pages/1');
    }
    if (response.status === 400) {
      setError(response.error);
    }
  };
  return (
    <MainContainer title="Вход">
      <HeaderMain />
      <section className="auth">
        <div className="auth__container">
          <h1 className="auth__title">Вход</h1>
          <form className="auth__form" onSubmit={handleSubmit}>
            <input className="auth__input" type="name" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
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
              {loading ? 'Вход...' : 'Вход'}
            </button>
          </form>
          <div className="auth__links">
            <Link className="auth__link" href="/register">
              Ещё нет аккаунта? Зарегистрироваться
            </Link>
            <Link className="auth__link" href="/forgot-password">
              Забыли пароль?
            </Link>
          </div>
          <div className="auth__action">
            <p className="auth__action-text">или</p>
            <div className="auth__action-buttons">
              <button id="googleSignInButtonLogin" className="auth__action-button auth__action-google "></button>
            </div>
          </div>
        </div>
      </section>
    </MainContainer>
  );
};

export default Login;
