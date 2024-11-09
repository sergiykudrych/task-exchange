import axios from 'axios';
import React from 'react';
import useUserStore from '../../data/stores/UseUserStore';

const Replenish = () => {
  const { user, addHistoryBalance, sendMessageInTelegram } = useUserStore((state) => state);
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState({
    text: '',
    status: '',
    show: false,
  });
  const Pay = async (e) => {
    e.preventDefault();

    if (amount < 5) {
      setMessages({
        text: 'Сумма должна быть больше 5$',
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
    }
    setLoading(true);
    try {
      const data = {
        amount: amount,
        shop_id: process.env.NEXT_PUBLIC_SHOP_ID,
        currency: 'USD',
      };
      const response = await axios.post(
        'https://api.cryptocloud.plus/v2/invoice/create',

        data,
        {
          headers: {
            Authorization: 'Token ' + process.env.NEXT_PUBLIC_TOKEN_CRYPTO,
            'Content-Type': 'application/json',
          },
        }
      );

      const body = {
        amount: amount,
        type: 'replenish',
        status: 'inprocess',
        hash: response.data.result.uuid,
        id: user.historyPay.length + 1,
        user: user.name,
        address: 'Пополнение баланса',
        methodOfReplenishment: 'Crypto',
      };
      let title = '<b>Заявка на пополнение баланса </b>\n';
      let message = '<b>Пользователь:</b> ' + user.name + '\n<b>Сумма:</b> ' + amount + '$' + '\n<b>Hash:</b> ' + response.data.result.uuid;
      await sendMessageInTelegram(title, message);
      const result = await addHistoryBalance(body);
      if (result.status === 200) {
        setMessages({
          text: 'Заявка на пополнение создана',
          status: 'success',
          show: true,
        });
        setLoading(false);
        // Таймер очистки сообщения
        setTimeout(() => {
          setMessages({
            text: '',
            status: '',
            show: false,
          });

          localStorage.setItem('invoiceId', response.data.result.uuid);
          setAmount(0);
          window.open(response.data.result.link, '_blank');
        }, 500);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="replenish">
      <div className="replenish__container">
        <h1 className="replenish__title">Пополнить баланс</h1>

        <form className="replenish__form" onSubmit={(e) => Pay(e)}>
          <label className="replenish__body-input">
            <p>Сумма</p>
            <input className="replenish__input" type="number" placeholder="0.00$" onChange={(e) => setAmount(e.target.value)} value={amount} />
            <p className="replenish__input-message">Минимальная сумма пополнения: 5.00$</p>
          </label>

          <label className="replenish__body-input">
            <p>Способ пополнения</p>
            <button className="replenish__body-button">
              <img src="/crypto.svg" alt="Crypto payment" />
              Crypto
            </button>
          </label>
          <button className="replenish__button button button--full">{loading ? 'Выполняется...' : 'Пополнить'}</button>
        </form>
      </div>
      <div className={messages.show ? 'message__popup active' : 'message__popup'}>
        <img src={messages.status === 'success' ? '/confirmed.svg' : '/error.svg'} alt="" />
        <p className="message__popup-text">{messages.text}</p>
      </div>
    </div>
  );
};

export default Replenish;
