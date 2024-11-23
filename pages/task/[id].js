import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

import MainContainer from '../../components/MainContainer';
import Header from '../../components/Works/Header';
import Loading from '../../components/Loading';
import MessageStatus from '../../components/MessageStatus';
import Forbidden from '../../components/Forbidden';

import UseTasksStore from '../../data/stores/UseTasksStore';
import useUserStore from '../../data/stores/UseUserStore';
// Додаємо назву компонента
const Task = ({ user }) => {
  const router = useRouter();
  const { sendMessages, changeBalance, addTaskInListCompleted } = useUserStore((state) => state);
  const [task, setTask] = useState({});
  const { getTask } = UseTasksStore((state) => state);
  const [showRaport, setShowRaport] = useState(true);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [completeImage, setCompleteImage] = useState({});
  const [ad, setAd] = useState([]);
  const [showCancel, setShowCancel] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [textCancel, setTextCancel] = useState('');
  const [messages, setMessages] = useState({
    text: '',
    status: '',
    show: false,
  });
  const imagebase64 = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const uploadImages = await imagebase64(file);
    setCompleteImage({ uploadImages });
  };
  const heandlerCompleteTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setMessages({
        text: 'Загрузка...',
        status: 'waiting',
        show: true,
      });
      const complete = {
        id: task.id,
        user: user.name,
        images: completeImage,
        description: description,
        status: 'waiting',
      };
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/complete-task', complete);
      console.log(response);
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
      }, 2000);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const handleChangeStatus = async (id, status) => {
    const complete = {
      id: task.id,
      historyId: id,
      status: status,
    };
    // Если подтвердили
    if (status === 'complete') {
      setMessages({
        text: 'Обновляем...',
        status: 'waiting',
        show: true,
      });
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/change-task-complete-status', complete);

      if (response?.data?.status === 200) {
        const message = {
          name: user.name,
          title: status === 'complete' ? `Вы виполнели задачу #${task.id}` : `Вы не виполнели задачу #${task.id}`,
          message: status === 'complete' ? 'Задача выполнена средства зачислены на ваш баланс' : 'Задача не выполнена по причине:\n ' + textCancel,
          type: status === 'complete' ? 'success' : 'error',
        };
        await sendMessages(message);
        await changeBalance({ name: user.name, balance: task.priceOneTask });
        await addTaskInListCompleted({ name: user.name, task: task });
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
        }, 2000);
      }

      setTask((prevTask) => ({
        ...prevTask,
        historyCompleted: prevTask.historyCompleted.map((item) => (item.id === id ? { ...item, status: 'complete' } : item)),
      }));
      return;
    }
    if (status === 'write') {
      setTask((prevTask) => ({
        ...prevTask,
        historyCompleted: prevTask.historyCompleted.map((item) => (item.id === id ? { ...item, status: 'write' } : item)),
      }));
      return;
    }
    if (status === 'cancel') {
      if (textCancel === '') {
        setTask((prevTask) => ({
          ...prevTask,
          historyCompleted: prevTask.historyCompleted.map((item) => (item.id === id ? { ...item, status: 'waiting' } : item)),
        }));
        return;
      } else {
        setMessages({
          text: 'Обновляем...',
          status: 'waiting',
          show: true,
        });
        const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/change-task-complete-status', complete);
        if (response?.data?.status === 200) {
          const message = {
            name: user.name,
            title: `Вы не виполнели задачу #${task.id}`,
            message: 'Задача не выполнена по причине:\n ' + textCancel,
            type: 'error',
          };
          await sendMessages(message);
          setMessages({
            text: response?.data?.message,
            status: response?.data?.status === 200 ? 'success' : 'error',
            show: true,
          });
          setTask((prevTask) => ({
            ...prevTask,
            historyCompleted: prevTask.historyCompleted.map((item) => (item.id === id ? { ...item, status: 'cancel' } : item)),
          }));
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
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (router.query.id) {
        const result = await getTask({ id: router.query.id });
        if (!result) {
          router.push('/404');
          return;
        }
        setTask(result);
      }
    };
    fetchData();
  }, [router.query.id]);

  if (!user) {
    return <Loading />;
  }

  if (!task.title) {
    return <Loading />;
  }
  // if (task.status !== 'active') {
  //   return (
  //     <MainContainer title={'Страница не найдена'}>
  //       <Header />
  //       <Forbidden title={'Страница не найдена'} />
  //     </MainContainer>
  //   );
  // }
  console.log(task);
  return (
    <MainContainer title={task?.title}>
      <Header />
      <div className="task">
        <div className="task__container">
          <div className="task__left">
            <div className="task__body">
              <div className="task__container-top">
                <div className="task__container-block">
                  <h1 className="task__title">{task?.title}</h1>
                  <p className="task__price">{task.priceOneTask} $</p>
                </div>
                <div className="task__container-block">
                  <p className="task__id">ID: {task.id}</p>
                  <Link href="/user/1" className="task__customer">
                    {/* <img src={task.castomer.userImage || '/icon-user.svg'} alt={task.castomer.name} /> */}
                    {task.creator}
                  </Link>
                </div>
                <div className="task__actions">
                  <div className="task__actions-item task__actions-item--green">
                    <span>{task.countDone}</span>
                    <p>Оплачено</p>
                  </div>
                  <div className="task__actions-item task__actions-item--blue">
                    <span>{task.countWait}</span>
                    <p>На проверке</p>
                  </div>

                  <div className="task__actions-item task__actions-item--red">
                    <span>{task.countRefused}</span>
                    <p>Отказано</p>
                  </div>
                </div>
              </div>
              <div className="task__container-description">
                <h2>Описание задания</h2>
                <p>{task.description}</p>
              </div>
              <div className="task__container-success">
                <h2>Подтверждения задания</h2>
                <p>{task.infoCompleted}</p>
              </div>
              <div className={'task__container-button ' + (!showRaport ? 'task__container-button--hide' : '') + ''}>
                <button className="button button--full task__actions-button" onClick={() => setShowRaport(false)}>
                  Выполнить задание
                </button>
              </div>
              <div className={'task__container-report ' + (showRaport ? 'task__container-report--show' : '')}>
                <div className="task__container-report--link">
                  <p>Ссылка на задание</p>
                  <a target="_blank" href={task.link}>
                    {task.link}
                  </a>
                </div>

                <form onSubmit={heandlerCompleteTask} className="task-complete-raport">
                  <textarea
                    className="task-complete-raport__textarea"
                    type="text"
                    name="description"
                    id="description"
                    cols="30"
                    rows="10"
                    placeholder="Описание задания"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  <div className="task-complete-raport__image">
                    {completeImage.uploadImages && <img src={completeImage.uploadImages} alt="image" />}
                  </div>
                  <div className="task-complete-raport__bottom">
                    <input type="file" className="task-complete-raport__file" onChange={handleFileChange} />
                    <button className="task-complete-raport__button button button--full" disabled={loading}>
                      {loading ? 'Загрузка...' : 'Завершить задание'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {task.creator === user?.name && (
              <div className="check-tasks">
                <div className="check-tasks__container">
                  <h1 className="check-tasks__title">Ожидают подтверждения</h1>
                  {task?.historyCompleted.length > 0 ? (
                    <ul className="check-tasks__list">
                      {task?.historyCompleted?.map((complete) => (
                        <li className="check-tasks__item" key={complete.id}>
                          <div className="check-tasks__item-top">
                            <p className="check-tasks__item-date">{complete.date}</p>
                          </div>
                          <h3 className="check-tasks__item-title">
                            Пользователь <span>{complete.user}</span> исполнил вашу задачу и ожидает проверку
                          </h3>
                          <p className="check-tasks__item-description">{complete.description}</p>

                          {complete?.images?.uploadImages && (
                            <div className="check-tasks__item-image">
                              <img src={complete?.images?.uploadImages} alt="check task image" />
                            </div>
                          )}
                          <div className="check-tasks__item-buttons">
                            {complete.status === 'cancel' && (
                              <p className="check-tasks__item-description check-tasks__item-description--cancel">Вы отклонили задание</p>
                            )}
                            {complete.status === 'complete' && (
                              <p className="check-tasks__item-description check-tasks__item-description--complete">Вы подтвердили задание</p>
                            )}
                            {complete.status === 'waiting' && (
                              <>
                                <button
                                  className="check-tasks__item-button button button--full"
                                  onClick={() => handleChangeStatus(complete.id, 'complete')}
                                >
                                  Подтвердить
                                </button>
                                <button
                                  className="check-tasks__item-button button button--red"
                                  onClick={() => handleChangeStatus(complete.id, 'write')}
                                >
                                  Отклонить
                                </button>
                              </>
                            )}
                          </div>
                          {complete.status === 'write' && (
                            <div className="check-tasks__item-popup">
                              <div className="check-tasks__item-popup-content">
                                <h3 className="check-tasks__item-title check-tasks__item-title--popup">Почему вы отклонили задачу?</h3>
                                <textarea
                                  type="text"
                                  className="check-tasks__item-textarea "
                                  value={textCancel}
                                  onChange={(e) => setTextCancel(e.target.value)}
                                ></textarea>
                                <button
                                  className="check-tasks__item-button--popup button button--red"
                                  onClick={() => handleChangeStatus(complete.id, 'cancel')}
                                >
                                  Отклонить
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="check-tasks__loading">Нет заданий</p>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* {ad.length == 0 && (
            <ul className="ad">
              {ad.map((item, index) => (
                <li className="ad-item" key={index}>
                  <Link className="ad-item__link" href={item.link}>
                    {item.title}
                  </Link>
                  <p className="ad-item__descripton">{item.description}</p>
                </li>
              ))}
            </ul>
          )} */}
        </div>
      </div>
      <MessageStatus show={messages.show} status={messages.status} text={messages.text} />
    </MainContainer>
  );
};

export default Task;
