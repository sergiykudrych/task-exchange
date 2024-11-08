import React from 'react';
import useUserStore from '../../data/stores/UseUserStore';

const Withdrawal = () => {
  const [amount, setAmount] = React.useState(0);
  const [address, setAddress] = React.useState('');
  const { user, addHistoryBalance, sendMessageInTelegram } = useUserStore((state) => state);
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState({
    text: '',
    status: '',
    show: false,
  });
  const handleChangeAmount = (e) => {
    setAmount(e);
  };
  const handleChangeAddress = (e) => {
    setAddress(e);
    const value1 = address.slice(0, 8);
    const value2 = address.slice(-8);
    return value1 + '...' + value2;
  };
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
    if (address.length < 10) {
      setMessages({
        text: 'Введите корректный адрес',
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

      const body = {
        amount: amount,
        type: 'withdrawal',
        status: 'inprocess',
        id: user.historyPay.length + 1,
        user: user.name,
        address: handleChangeAddress(),
        methodOfReplenishment: 'Crypto',
      };
      let title = '<b>Заявка на снятие средств </b>\n';
      let message = '<b>Пользователь:</b> ' + user.name + '\n<b>Сумма:</b> ' + amount + '$' + '\n<b>Address:</b>\n' + address;
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
        }, 2000);
        setLoading(false);
        setAmount(0);
        setAddress('');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="withdrawal">
      <div className="withdrawal__container">
        <h1 className="withdrawal__title">Вывести средства</h1>

        <form className="withdrawal__form" onSubmit={Pay}>
          <label className="withdrawal__body-label">
            <p>Сумма</p>
            <input
              className="withdrawal__input"
              type="number"
              placeholder="0.00$"
              onChange={(e) => handleChangeAmount(e.target.value)}
              value={amount}
            />
            <p className="withdrawal__input-message">Минимальная сумма вывода: 5.00$</p>
          </label>

          <label className="withdrawal__body-label">
            <p>Способ вывода</p>
            <div className="withdrawal__body-button">
              <img src="/crypto.svg" alt="Crypto payment" />
              Crypto
            </div>
          </label>
          <label className="withdrawal__body-label withdrawal--address">
            <p>Адрес кошелька TRC-20</p>
            <input
              className="withdrawal__input"
              type="text"
              placeholder="TRC-20"
              onChange={(e) => handleChangeAddress(e.target.value)}
              value={address}
            />
          </label>
          <button className="withdrawal__button button button--full">{loading ? 'Выполняется...' : 'Вывести'}</button>
        </form>
      </div>
      <div className={messages.show ? 'message__popup active' : 'message__popup'}>
        <img src={messages.status === 'success' ? '/confirmed.svg' : '/error.svg'} alt="" />
        <p className="message__popup-text">{messages.text}</p>
      </div>
    </div>
  );
};

export default Withdrawal;
