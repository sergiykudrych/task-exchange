import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import LoadingSimple from '../components/LoadingSimple';
import Loading from '../components/Loading';

import useUserStore from '../data/stores/UseUserStore';
import UseTasksStore from '../data/stores/UseTasksStore';
const MyTasks = () => {
  const router = useRouter();
  const { user, refreshToken } = useUserStore((state) => state);
  const { getMyTasksAll, tasks, loading } = UseTasksStore((state) => state);
  useEffect(() => {
    const fetchData = async () => {
      await getMyTasksAll(user?.name);
    };
    fetchData();
  }, [user?.name]);

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
      <MainContainer title={'Мои задачи'}>
        <Header />
        <div className="my-task">
          <div className="my-task__container">
            <div className="my-task__container-top">
              <h1 className="my-task__title">Мои задачи</h1>
              <Link href="/create-task" className="my-task__create-task button button--full">
                Создать задачу
              </Link>
            </div>
            {loading && <LoadingSimple />}
            <ul className="my-task__list">
              {tasks?.length > 0 &&
                tasks.map((task) => (
                  <li className={task.inTop ? 'my-task__item my-task__item--top ' : 'my-task__item ' + task.status} key={task._id}>
                    <div className="my-task__item-top">
                      <div className="my-task__item-icon">
                        <img src="/star-white.svg" alt="Top task" />
                      </div>
                      <Link href={'/task/' + task.id} className="my-task__item-link">
                        {task.title}
                      </Link>
                      <p className="my-task__item-price">{task.priceOneTask} $</p>
                      <Link className="my-task__item-pen" href={'/update-task/' + task.id}>
                        <img src="/pen.svg" alt="" />
                      </Link>
                    </div>
                    <p className="my-task__item-description">{task.description}</p>
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
                      {task.status === 'waiting' && (
                        <div className="my-task__item-status waiting">
                          <span></span>Ожидает подтверждения
                        </div>
                      )}
                      {task.status === 'active' && (
                        <div className="my-task__item-status active">
                          <span></span>Активная
                        </div>
                      )}
                      {task.status === 'not_active' && (
                        <div className="my-task__item-status not_active">
                          <span></span>Не активная
                        </div>
                      )}
                      {task.status === 'denied' && (
                        <div className="my-task__item-status denied">
                          <span></span>Отказано
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </MainContainer>
    </>
  );
};

export default MyTasks;
