import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import SelectCustom from '../components/CreateTask/Select';
import Loading from '../components/Loading';

import UseTaskStore from '../data/stores/UseTasksStore';
import useUserStore from '../data/stores/UseUserStore';
const CreateTask = ({ user }) => {
  const router = useRouter();
  const { sendMessageInTelegram } = useUserStore((state) => state);
  const { createTask } = UseTaskStore((state) => state);
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [link, setLink] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [infoCompleted, setInfoCompleted] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [countCompleted, setCountCompleted] = React.useState('');
  const [topDay, setTopDay] = React.useState('');

  const [priceOneTaskForCreator, setPriceOneTaskForCreator] = useState('');
  const [countNeedTasks, setCountNeedTasks] = useState('');
  const [beenInTopDays, setBeenInTopDays] = useState('');
  const [toPay, setToPay] = React.useState('');
  const [messages, setMessages] = React.useState({
    text: '',
    status: '',
    show: false,
  });

  const heandlerNameTask = (e) => {
    if (e.length < 5) {
      document.querySelector('.new-task__message-name').classList.add('error');
      document.querySelector('.new-task__input-name').classList.add('error');
      document.querySelector('.new-task__button').classList.add('disabled');
    } else {
      document.querySelector('.new-task__button').classList.remove('disabled');
      document.querySelector('.new-task__message-name').classList.remove('error');
      document.querySelector('.new-task__input-name').classList.remove('error');
    }
    setTitle(e);
  };
  const heandlerLink = (e) => {
    if (e.length == 0) {
      document.querySelector('.new-task__button').classList.add('disabled');
      document.querySelector('.new-task__message-link').classList.add('error');
      document.querySelector('.new-task__input-link').classList.add('error');
    } else {
      document.querySelector('.new-task__button').classList.remove('disabled');
      document.querySelector('.new-task__message-link').classList.remove('error');
      document.querySelector('.new-task__input-link').classList.remove('error');
    }
    setLink(e);
  };
  const heandlerDescription = (e) => {
    if (e.length < 5) {
      document.querySelector('.new-task__button').classList.add('disabled');
      document.querySelector('.new-task__message-description').classList.add('error');
      document.querySelector('.new-task__textarea-description').classList.add('error');
    } else {
      document.querySelector('.new-task__button').classList.remove('disabled');
      document.querySelector('.new-task__message-description').classList.remove('error');
      document.querySelector('.new-task__textarea-description').classList.remove('error');
    }
    setDescription(e);
  };
  const handlerInfoCompleted = (e) => {
    document.querySelector('.new-task__button').classList.remove('disabled');
    document.querySelector('.new-task__message-info-completed').classList.remove('error');
    document.querySelector('.new-task__textarea-info-completed').classList.remove('error');
    setInfoCompleted(e);
  };

  const handlerPriceOneTask = (e) => {
    if (+e.target.value >= 0) {
      if (+e.target.value === 0.1) {
        setMessages({
          text: 'Минимальная цена задачи 0.2 $',
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
      setPriceOneTaskForCreator(e.target.value);
      let price = (Number(e.target.value) * Number(countNeedTasks) + Number(beenInTopDays)).toFixed(1);
      setToPay(price);
    } else {
      setPriceOneTaskForCreator(0);
    }
  };
  const handlerCountNeedTasks = (e) => {
    if (+e.target.value >= 1) {
      setCountNeedTasks(e.target.value);
      let price = (Number(e.target.value) * Number(priceOneTaskForCreator) + Number(beenInTopDays)).toFixed(1);
      setToPay(price);
    } else {
      setCountNeedTasks(0);
    }
  };
  const handlerBeenInTopDays = (e) => {
    if (+e.target.value >= 0) {
      setBeenInTopDays(e.target.value);
      let price = (Number(countNeedTasks) * Number(priceOneTaskForCreator) + Number(e.target.value)).toFixed(1);
      setToPay(price);
    } else {
      setBeenInTopDays(0);
    }
  };
  const handlerCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (category === '') {
      setMessages({
        text: 'Выберите категорию',
        status: 'error',
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
      return;
    }
    if (user?.balance < toPay) {
      setMessages({
        text: 'Недостаточно средств',
        status: 'error',
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
      return;
    }
    const getDate = (currentDate) => {
      const date = new Date();
      date.setDate(date.getDate() + currentDate);
      const futureDate = date.toLocaleDateString();
      return futureDate;
    };
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Форматируем дату в YYYY-MM-DD
    const nextWeekStr = nextWeek.toISOString().slice(0, 10);

    let newTask = {
      title: title,
      description: description,
      status: 'waiting',
      creator: user?.name,
      link: link,
      category: category.value,
      categoryLabel: category.label,
      price: priceOneTaskForCreator,
      infoCompleted: infoCompleted,
      inTop: beenInTopDays > 0 ? true : false,
      inTopDays: beenInTopDays,
      topDays: getDate(beenInTopDays),
      priceOneTask: priceOneTaskForCreator - 0.1,
      countTasks: countNeedTasks,
      countDone: 0,
      countWait: 0,
      countRefused: 0,
      dateCreate: getDate(0),
      dateEnd: nextWeekStr,
      historyCompleted: [],
    };
    let titleMessages = '<b>Добавление задания </b>\n';
    let message =
      'Пользователь: <b>' + user?.name + '</b> добавил задание <b>' + titleMessages + '</b>\n' + process.env.NEXT_PUBLIC_API_URL + '/all-tasks';
    await sendMessageInTelegram(titleMessages, message);
    const response = await createTask({ newTask, toPay });
    setMessages({
      text: response?.data?.message,
      status: response?.data?.status === 200 ? 'success' : 'error',
      show: true,
    });

    // Таймер очистки сообщения
    setTimeout(() => {
      setMessages({
        text: '',
        status: '',
        show: false,
      });
      router.push('/tasks/pages/1');
    }, 500);
    setLoading(false);
  };

  if (!user) return <Loading />;
  return (
    <>
      <MainContainer title={'Добавление задание'}>
        <Header />
        <div className="new-task create-task">
          <div className="new-task__container">
            <h1 className="new-task__title">Новая задача</h1>
            <div className="new-task__body">
              <form className="new-task__form" onSubmit={handlerCreateTask}>
                <h2 className="new-task__body-title">Описание задание</h2>
                <label className="new-task__body-label">
                  <p>Название</p>
                  <input
                    className="new-task__input new-task__input-name"
                    type="text"
                    placeholder="Название задачи"
                    value={title}
                    required
                    onChange={(e) => heandlerNameTask(e.target.value)}
                  />
                  <span className="new-task__input-message new-task__message-name ">
                    Короткое название (5 символов минимум), передающее суть задания.
                  </span>
                </label>
                <label className="new-task__body-label">
                  <p>Категория</p>
                  <SelectCustom setCategory={setCategory} />
                </label>
                <label className="new-task__body-label">
                  <p>Ссылка</p>
                  <input
                    className="new-task__input new-task__input-link"
                    type="text"
                    placeholder="https://"
                    value={link}
                    required
                    onChange={(e) => heandlerLink(e.target.value)}
                  />
                  <span className="new-task__input-message new-task__message-link">Ссылка на выполнение задания</span>
                </label>
                <label className="new-task__body-label">
                  <p>Описание</p>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => heandlerDescription(e.target.value)}
                    className="new-task__textarea new-task__textarea-description"
                    placeholder="Распишите по пунктам, что нужно сделать в вашем задании."
                  ></textarea>
                  <span className="new-task__input-message new-task__message-description">
                    Распишите по пунктам, что должен сделать пользователь, не меньше 5 символов.
                  </span>
                </label>
                <h2 className="new-task__body-title">Проверка задание</h2>
                <label className="new-task__body-label">
                  <p>Информация для подтверждения</p>
                  <textarea
                    required
                    value={infoCompleted}
                    onChange={(e) => handlerInfoCompleted(e.target.value)}
                    className="new-task__textarea new-task__textarea-info-completed"
                    placeholder="Распишите по пунктам, какую информацию пользователь должен оставить в отчёте."
                  ></textarea>
                  <span className="new-task__input-message new-task__message-info-completed">
                    Напишите какую информацию пользователь должен оставить в отчёте, чтобы вы проверили правильность выполнения задания.
                  </span>
                </label>
                <h2 className="new-task__body-title">Цена, количество</h2>
                <div className="new-task__body-price">
                  <label className="new-task__body-label">
                    <p>Цена за одно завершенное задание</p>
                    <input
                      name="priceOneTaskForCreator"
                      className="new-task__input"
                      type="number"
                      placeholder="0"
                      value={priceOneTaskForCreator || ''}
                      onChange={handlerPriceOneTask}
                    />
                  </label>
                  <label className="new-task__body-label">
                    <p>Количество заданий</p>
                    <input
                      name="countNeedTasks"
                      className="new-task__input "
                      type="tel"
                      placeholder="0"
                      value={countNeedTasks || ''}
                      onChange={handlerCountNeedTasks}
                    />
                  </label>
                  <label className="new-task__body-label">
                    <p>Итого</p>
                    <input
                      name="summPrice"
                      readOnly
                      className="new-task__input"
                      type="tel"
                      placeholder="0"
                      value={(priceOneTaskForCreator * countNeedTasks).toFixed(1) || ''}
                    />
                  </label>
                  <label className="new-task__body-label">
                    <p>Быть в ТОП 1 день = 1$</p>
                    <input
                      name="topDay"
                      className="new-task__input"
                      type="tel"
                      placeholder="0"
                      value={beenInTopDays || ''}
                      onChange={handlerBeenInTopDays}
                    />
                  </label>
                </div>
                <div className="new-task__total-info">
                  <h2 className="new-task__body-title">Общая информация</h2>

                  <p className="new-task__total-info-text">
                    Цена для заказчика: <span>{priceOneTaskForCreator}</span>
                  </p>
                  <p className="new-task__total-info-text">
                    Кол. выполнений: <span>{countNeedTasks}</span>
                  </p>
                  <p className="new-task__total-info-text">
                    Оплата для исполнителя: <span>{priceOneTaskForCreator > 0 ? priceOneTaskForCreator - 0.1 : 0} </span>
                  </p>
                  <p className="new-task__total-info-text">
                    Задание в ТОП дней: <span>{beenInTopDays}</span>
                  </p>
                </div>
                <h2 className="new-task__body-title">К оплате: {toPay || 0} $</h2>

                <div className="new-task__body-button">
                  <Link href="/my-tasks" className=" button button--cancel">
                    Отменить
                  </Link>
                  <button className="new-task__button button button--full ">{loading ? 'Загрузка...' : 'Создать задание'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className={messages.show ? 'message__popup active' : 'message__popup'}>
          <img src={messages.status === 'success' ? '/confirmed.svg' : '/error.svg'} alt="" />
          <p className="message__popup-text">{messages.text}</p>
        </div>
      </MainContainer>
    </>
  );
};

export default CreateTask;
