import React from 'react';
import useUserStore from '../../data/stores/UseUserStore';

const History = () => {
  const user = useUserStore((state) => state.user);
  return (
    <div className="history">
      <div className="history__container">
        <h1 className="history__title">История операций</h1>
        {user?.historyPay.length > 0 ? (
          <ul className="history__body">
            {user?.historyPay.map((item) => (
              <li key={item.id} className={'history__body-item history__body-item--' + item.type}>
                <p className="history__body-id">#{item.id}</p>
                <p className="history__body-status">
                  <img
                    className="history__body-img"
                    src={item.status === 'success' ? '/done.svg' : item.status === 'inprocess' ? '/wait.png' : '/error.svg'}
                    alt="status="
                  />
                  <span> {item.status === 'success' ? 'Успешно' : item.status === 'inprocess' ? 'Ожидается' : 'Отмена'}</span>
                </p>
                <p className="history__body-type">{item.type === 'replenish' ? 'Пополнение' : 'Вывод'}</p>
                <p className="history__body-date">{item.date}</p>
                <p className="history__body-address">{item.address}</p>
                <p className={'history__body-summa history__body-summa--' + item.status}>
                  {item.type === 'withdrawal' ? '-' : '+'}
                  {item.amount}$
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="history__null">Пока ничего нет</p>
        )}
      </div>
    </div>
  );
};

export default History;
