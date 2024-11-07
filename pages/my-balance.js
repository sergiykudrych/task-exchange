import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import Header from '../components/Works/Header';
import MainContainer from '../components/MainContainer';
import Replenish from '../components/Balance/Replenish';
import Withdrawal from '../components/Balance/Withdrawal';
import History from '../components/Balance/History';
import Loading from '../components/Loading';

import useUserStore from '../data/stores/UseUserStore';
const MyBalance = () => {
  const router = useRouter();
  const { user, refreshToken } = useUserStore((state) => state);
  const [toggleState, setToggleState] = React.useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const handleAuth = async (Token) => {
    try {
      const responce = await refreshToken(Token);
      if (responce.status === 200) {
        setIsAuth(true);
      } else {
        router.push('/login');
      }
    } catch (error) {}
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        handleAuth(refreshToken);
      } else {
        router.push('/login');
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (!user) return <Loading />;
  return (
    <>
      <MainContainer title={'Мой баланс'}>
        <Header />
        <div className="payment">
          <div className="payment__container">
            <h1 className="payment__title">
              Баланс: <span>{user.balance}$</span>
            </h1>

            <div className="payment__body-tab">
              <div className="payment__buttons-tab">
                <button
                  onClick={() => toggleTab(1)}
                  className={toggleState === 1 ? 'payment__button-tab-item active-button' : 'payment__button-tab-item'}
                >
                  Пополнить
                </button>
                <button
                  onClick={() => toggleTab(2)}
                  className={toggleState === 2 ? 'payment__button-tab-item active-button' : 'payment__button-tab-item'}
                >
                  Вивести
                </button>
              </div>
              <div className="payment__contents-tab">
                <div className={toggleState === 1 ? 'payment__content-tab-item active-content' : 'payment__content-tab-item'}>
                  <Replenish />
                </div>
                <div className={toggleState === 2 ? 'payment__content-tab-item active-content' : 'payment__content-tab-item'}>
                  <Withdrawal />
                </div>
              </div>
            </div>
          </div>
          <History />
        </div>
      </MainContainer>
    </>
  );
};

export default MyBalance;
