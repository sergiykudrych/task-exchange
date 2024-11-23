import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import Loading from '../components/Loading';

import useUserStore from '../data/stores/UseUserStore';
import MessageStatus from '../components/MessageStatus';
const ChangePlan = ({ user }) => {
  const { changePlan } = useUserStore((state) => state);
  const [messages, setMessages] = React.useState({
    text: '',
    status: '',
    show: false,
  });
  const handleChangePlan = async (plan, price) => {
    if (price > user?.balance) {
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
      return;
    } else {
      try {
        setMessages({
          text: 'Смена плана...',
          status: 'waiting',
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
        const body = { name: user?.name, plan, price };
        const response = await changePlan(body);
        setMessages({
          text: response?.messages,
          status: response?.status === 200 ? 'success' : 'error',
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
      } catch (error) {
        setMessages({
          text: 'Не удалось сменить план',
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
      }
    }
  };

  if (!user) return <Loading />;
  return (
    <>
      <MainContainer title={'Изменение плана'}>
        <Header />
        <div className="change-plan">
          <div className="change-plan__container">
            <h1 className="change-plan__title">Изменение плана</h1>

            <ul className="change-plan__list">
              <li className="change-plan__item">
                <h2 className="change-plan__item-title">BASIC</h2>
                <ul className="change-plan__characteristic plan__characteristic">
                  <li className="plan__characteristic-item">
                    <img src="/done.svg" alt="Done" />
                    <span>Количество задач на день - 5</span>
                  </li>
                  <li className="plan__characteristic-item plan__characteristic-item--off">
                    <img src="/error.svg" alt="Error" />
                    <span>Возможность создавать свои задачи</span>
                  </li>
                  <li className="plan__characteristic-item plan__characteristic-item--off">
                    <img src="/error.svg" alt="Error" />
                    <div>
                      <span>Возможность брать задачи из "Без категорий"</span>
                      <span>Всё же знают где деньги</span>
                    </div>
                  </li>
                  <li className="plan__characteristic-item plan__characteristic-item--off">
                    <img src="/error.svg" alt="Error" />
                    <span>Возможность связаться с другими пользователями</span>
                  </li>
                  <li className="plan__characteristic-item plan__characteristic-item--off">
                    <img src="/error.svg" alt="Error" />
                    <span>Возможность видеть топ исполнителей</span>
                  </li>
                </ul>
                <div className="change-plan__price">
                  <p className="change-plan__price-new">
                    <span>$0.00</span>/месяц
                  </p>
                </div>
                {user?.plan === 'BASIC' ? (
                  <button className="change-plan__btn button button--full button--disabled">Ваш план</button>
                ) : (
                  <button onClick={() => handleChangePlan('BASIC', 0)} className="change-plan__btn button button--border">
                    Выбрать план
                  </button>
                )}
              </li>
              <li className="change-plan__item change-plan__item--premium">
                <h2 className="change-plan__item-title">PREMIUM</h2>
                <ul className="change-plan__characteristic plan__characteristic">
                  <li className="plan__characteristic-item">
                    <img src="/done.svg" alt="Done" />
                    <span>Количество задач на день - без лимитов</span>
                  </li>
                  <li className="plan__characteristic-item">
                    <img src="/done.svg" alt="Done" />
                    <span>Возможность создавать свои задачи</span>
                  </li>
                  <li className="plan__characteristic-item">
                    <img src="/done.svg" alt="Done" />
                    <div>
                      <span>Возможность брать задачи из "Без категорий"</span>
                      <span>Всё же знают где деньги</span>
                    </div>
                  </li>
                  <li className="plan__characteristic-item">
                    <img src="/done.svg" alt="Done" />
                    <span>Возможность связаться с другими пользователями</span>
                  </li>
                  <li className="plan__characteristic-item">
                    <img src="/done.svg" alt="Done" />
                    <span>Возможность видеть топ исполнителей</span>
                  </li>
                </ul>
                <div className="change-plan__price">
                  <p className="change-plan__price-new">
                    <span>$9.99</span>/месяц
                  </p>
                  <p className="change-plan__price-old">
                    <span>$20.00</span>/месяц
                  </p>
                </div>
                {user?.plan === 'PREMIUM' ? (
                  <button className="change-plan__btn button button--full button--disabled">Ваш план</button>
                ) : (
                  <button onClick={() => handleChangePlan('PREMIUM', 9.99)} className="change-plan__btn button button--border">
                    Выбрать план
                  </button>
                )}
                <div className="change-plan__sale">-50%</div>
              </li>
              <li className="change-plan__item">
                <h2 className="change-plan__item-title">START</h2>
                <ul className="change-plan__characteristic plan__characteristic">
                  <li className="plan__characteristic-item">
                    <img src="/done.svg" alt="Done" />
                    <span>Количество задач на день - 15</span>
                  </li>
                  <li className="plan__characteristic-item">
                    <img src="/done.svg" alt="Done" />
                    <span>Возможность создавать свои задачи</span>
                  </li>
                  <li className="plan__characteristic-item ">
                    <img src="/done.svg" alt="Done" />
                    <div>
                      <span>Возможность брать задачи из "Без категорий"</span>
                      <span>Всё же знают где деньги</span>
                    </div>
                  </li>
                  <li className="plan__characteristic-item plan__characteristic-item--off">
                    <img src="/error.svg" alt="Error" />
                    <span>Возможность связаться с другими пользователями</span>
                  </li>
                  <li className="plan__characteristic-item plan__characteristic-item--off">
                    <img src="/error.svg" alt="Error" />
                    <span>Возможность видеть топ исполнителей</span>
                  </li>
                </ul>
                <div className="change-plan__price">
                  <p className="change-plan__price-new">
                    <span>$5.00</span>/месяц
                  </p>
                  {/* <p className="change-plan__price-old">
                    <span>$10.00</span>/месяц
                  </p> */}
                </div>
                {user?.plan === 'START' ? (
                  <button className="change-plan__btn button button--full button--disabled">Ваш план</button>
                ) : (
                  <button onClick={() => handleChangePlan('START', 5.0)} className="change-plan__btn button button--border">
                    Выбрать план
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
        <MessageStatus show={messages.show} status={messages.status} text={messages.text} />
      </MainContainer>
    </>
  );
};

export default ChangePlan;
