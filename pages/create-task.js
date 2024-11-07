import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import SelectCustom from '../components/CreateTask/Select';
import Loading from '../components/Loading';

import UseTaskStore from '../data/stores/UseTasksStore';
import useUserStore from '../data/stores/UseUserStore';
import useCategoryStore from '../data/stores/UseCategory';
const CreateTask = () => {
  const router = useRouter();
  const { categories, getCategory } = useCategoryStore((state) => state);
  const { user, refreshToken } = useUserStore((state) => state);
  const { createTask } = UseTaskStore((state) => state);
  const [messages, setMessages] = React.useState({
    text: '',
    status: '',
    show: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [link, setLink] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [infoCompleted, setInfoCompleted] = React.useState('');
  const [price, setPrice] = React.useState(1);
  const [countCompleted, setCountCompleted] = React.useState(1);
  const [topDay, setTopDay] = React.useState(0);
  const [toPay, setToPay] = React.useState(0);
  const [summPrice, setSummPrice] = React.useState(0);

  React.useEffect(() => {
    const totalPayForCompleted = price * countCompleted;
    setSummPrice(totalPayForCompleted);

    const totalPay = totalPayForCompleted + topDay;
    setToPay(totalPay);
  }, [countCompleted, price, topDay]);

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
    if (e.length < 50) {
      document.querySelector('.new-task__button').classList.add('disabled');

      document.querySelector('.new-task__message-info-completed').classList.add('error');
      document.querySelector('.new-task__textarea-info-completed').classList.add('error');
    } else {
      document.querySelector('.new-task__button').classList.remove('disabled');
      document.querySelector('.new-task__message-info-completed').classList.remove('error');
      document.querySelector('.new-task__textarea-info-completed').classList.remove('error');
    }
    setInfoCompleted(e);
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
    const nextWeek = new Date(today); // Копируем текущую дату
    nextWeek.setDate(today.getDate() + 7); // Добавляем 7 дней

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
      price: price,
      infoCompleted: infoCompleted,
      inTop: topDay > 0 ? true : false,
      inTopDays: topDay,
      topDays: getDate(topDay),
      priceOneTask: price - 0.1,
      countTasks: countCompleted,
      countDone: 0,
      countWait: 0,
      countRefused: 0,
      dateCreate: getDate(0),
      dateEnd: nextWeekStr,
      historyCompleted: [],
    };
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
                    Напишите какую информацию пользователь должен оставить в отчёте, чтобы вы проверили правильность выполнения задания. Не меньше 50
                    символов.
                  </span>
                </label>
                <h2 className="new-task__body-title">Цена, количество</h2>
                <div className="new-task__body-price">
                  <label className="new-task__body-label">
                    <p>Цена за одно завершенное задание</p>
                    <input
                      className="new-task__input"
                      type="number"
                      placeholder="100"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </label>
                  <label className="new-task__body-label">
                    <p>Количество завершенных заданий</p>
                    <input
                      className="new-task__input "
                      type="number"
                      placeholder="1"
                      value={countCompleted}
                      onChange={(e) => setCountCompleted(Number(e.target.value))}
                    />
                  </label>
                  <label className="new-task__body-label">
                    <p>Итого</p>
                    <input readOnly className="new-task__input" type="number" placeholder="1" value={summPrice} />
                  </label>
                  <label className="new-task__body-label">
                    <p>Быть в ТОП 1 день = 1$</p>
                    <input
                      className="new-task__input"
                      type="number"
                      placeholder="К-во дней"
                      value={topDay}
                      onChange={(e) => setTopDay(Number(e.target.value))}
                    />
                  </label>
                </div>
                <div className="new-task__total-info">
                  <h2 className="new-task__body-title">Общая информация</h2>

                  <p className="new-task__total-info-text">
                    Кол. выполнений: <span>{countCompleted}</span>
                  </p>
                  <p className="new-task__total-info-text">
                    Цена для заказчика: <span>{price}</span>
                  </p>
                  <p className="new-task__total-info-text">
                    Оплата для исполнителя: <span>{price - 0.1} </span>
                  </p>
                  <p className="new-task__total-info-text">
                    Задание в ТОП дней: <span>{topDay}</span>
                  </p>
                </div>
                <h2 className="new-task__body-title">С вашего баланса будет снята сумма: {toPay} $</h2>
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
