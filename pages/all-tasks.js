import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import LoadingSimple from '../components/LoadingSimple';
import Loading from '../components/Loading';
import Forbidden from '../components/Forbidden';

import UseTasksStore from '../data/stores/UseTasksStore';
import MessageStatus from '../components/MessageStatus';
const AllTasks = ({ user }) => {
  const { getAllTasksAdmin, tasks, loading, changeStatusTask, deleteTask } = UseTasksStore((state) => state);

  const [filters, setFilters] = useState({
    category: '',
    status: '',
    id: '',
    user: '',
  });

  const [messages, setMessages] = React.useState({
    text: '',
    status: '',
    show: false,
  });
  useEffect(() => {
    const fetchData = async () => {
      await getAllTasksAdmin();
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  const handleDeleteTask = async (taskId) => {
    try {
      setMessages({
        text: 'Удаление задачи...',
        status: 'waiting',
        show: true,
      });
      const response = await deleteTask(taskId);
      setMessages({
        text: response.data.message,
        status: response.status === 200 ? 'success' : 'error',
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
    } catch (error) {}
  };
  const handleFilterStatusChange = async (e, taskId) => {
    if (e.target.value === '') return;
    try {
      setMessages({
        text: 'Смена статуса задачи...',
        status: 'success',
        show: true,
      });
      const newStatus = e.target.value;
      const response = await changeStatusTask({ id: taskId, status: newStatus });
      setMessages({
        text: response.message,
        status: response.status === 200 ? 'success' : 'error',
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
    } catch (error) {}
  };
  const filteredTasks = tasks?.filter((task) => {
    return (
      (filters.category ? task.category === filters.category : true) &&
      (filters.status ? task.status === filters.status : true) &&
      (filters.id ? String(task.id).includes(filters.id) : true) &&
      (filters.user ? task.user === filters.user : true)
    );
  });

  if (!user) return <Loading />;
  if (user.role !== 'ADMIN') {
    return (
      <MainContainer title={'У вас нет прав для этой страницы'}>
        <Header />
        <Forbidden title={'У вас нет прав для этой страницы'} />
      </MainContainer>
    );
  }

  return (
    <>
      <MainContainer title={'Вcё задачи'}>
        <Header />
        <div className="my-task">
          <div className="my-task__container">
            <div className="my-task__container-top">
              <h1 className="my-task__title">Всё задачи</h1>
            </div>

            {/* Фильтры */}
            <div className="filters">
              <select className="filters__select" name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">Все категории</option>
                <option value="social">Соц сети</option>
                <option value="not-category">Без категории</option>
              </select>

              <select className="filters__select" name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">Все статусы</option>
                <option value="waiting">Ожидает подтверждения</option>
                <option value="active">Активная</option>
                <option value="not_active">Не активная</option>
                <option value="denied">Отказано</option>
              </select>

              <input className="filters__select" type="text" name="id" placeholder="ID задачи" value={filters.id} onChange={handleFilterChange} />
              <input
                className="filters__select"
                type="text"
                name="user"
                placeholder="Пользователь"
                value={filters.user}
                onChange={handleFilterChange}
              />
            </div>

            {loading && <LoadingSimple />}
            <ul className="my-task__list">
              {filteredTasks?.length > 0 ? (
                filteredTasks.map((task) => (
                  <li className={task.inTop ? 'my-task__item my-task__item--top ' : 'my-task__item ' + task.status} key={task.id}>
                    <div className="my-task__item-top">
                      <Link href={'/task/' + task.id} className="my-task__item-link">
                        {task.title}
                      </Link>
                      <p className="my-task__item-price">{task.priceOneTask} $</p>
                      <Link className="my-task__item-pen" href={'/update-task/' + task.id}>
                        <img src="/pen.svg" alt="" />
                      </Link>
                      <button style={{ cursor: 'pointer', backgroundColor: 'transparent' }} onClick={() => handleDeleteTask(task.id)}>
                        <img style={{ width: '20px', height: '20px', maxWidth: '20px', maxHeight: '20px' }} src="/error.svg" alt="" />
                      </button>
                    </div>
                    <p className="my-task__item-description">{task.description}</p>
                    <Link className="my-task__item-link" href={'/user/' + task.creator}>
                      {task.creator}
                    </Link>
                    <div className="my-task__item-bottom">
                      <div className="my-task__item-statistic">
                        <div className="my-task__item-statistic-item my-task__item-statistic-item--completed">
                          <span>{task.countDone}</span>
                          <p>Оплачено</p>
                        </div>
                        <Link href="/task/1" className="my-task__item-statistic-item my-task__item-statistic-item--inprocess">
                          <span>{task.countWait}</span>
                          <p>На проверке</p>
                        </Link>
                        <div className="my-task__item-statistic-item  my-task__item-statistic-item--denied">
                          <span>{task.countRefused}</span>
                          <p>Отказано</p>
                        </div>
                      </div>
                      <div>
                        <div className={`filters__body my-task__item-status ${task.status}`}>
                          <span></span>

                          <select value={task.status} name="category" onChange={(e) => handleFilterStatusChange(e, task.id)}>
                            <option value="waiting">Ожидает подтверждения</option>
                            <option value="active">Активная</option>
                            <option value="not_active">Не активная</option>
                            <option value="denied">Отказано</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>Нет задач, соответствующих выбранным фильтрам.</p>
              )}
            </ul>
          </div>
        </div>
        <MessageStatus show={messages.show} status={messages.status} text={messages.text} />
      </MainContainer>
    </>
  );
};

export default AllTasks;
