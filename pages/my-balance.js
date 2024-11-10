import React from 'react';

import Header from '../components/Works/Header';
import MainContainer from '../components/MainContainer';
import Replenish from '../components/Balance/Replenish';
import Withdrawal from '../components/Balance/Withdrawal';
import History from '../components/Balance/History';
import Loading from '../components/Loading';

const MyBalance = ({ user }) => {
  const [toggleState, setToggleState] = React.useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

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
