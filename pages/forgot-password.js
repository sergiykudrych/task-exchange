import React, { useState } from 'react';
import MainContainer from '../components/MainContainer';
import HeaderMain from '../components/Home/HeaderMain';
import useUserStore from '../data/stores/UseUserStore';
import { useRouter } from 'next/router';
const ForgotPassword = () => {
  const router = useRouter();
  const { resetPassword } = useUserStore();
  const [formData, setFormData] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError('');
      const response = await resetPassword(formData.email);
      if (response.status === 200) {
        setMessage(response.response);
      } else {
        setError(response.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <MainContainer title="Востановление пароля">
        <HeaderMain />
        <section className="auth">
          <div className="auth__container">
            <h1 className="auth__title">Востановление пароля</h1>
            {!message && (
              <form className="auth__form" onSubmit={handleSubmit}>
                <input
                  className="auth__input"
                  type="name"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                {error && <span className={'auth__input-message ' + (error ? 'error' : '')}>{error}</span>}
                <button className="auth__button button button--full" type="submit" disabled={loading}>
                  {loading ? 'загрузка...' : 'Востановить'}
                </button>
              </form>
            )}
            {message && <span className="auth__input-message-success">{message}</span>}
          </div>
        </section>
      </MainContainer>
    </>
  );
};

export default ForgotPassword;
