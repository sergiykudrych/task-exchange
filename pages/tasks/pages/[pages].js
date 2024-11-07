import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import MainContainer from '../../../components/MainContainer';
import Header from '../../../components/Works/Header';
import Pagination from '../../../components/Tasks/Pagination';
import Filter from '../../../components/Tasks/Filter';
import TasksList from '../../../components/Tasks/TasksList';
import TopExecutorList from '../../../components/Tasks/TopExecutorList';
import TopExecutorListBlur from '../../../components/Tasks/TopExecutorListBlur';
import Loading from '../../../components/Loading';

import UseTasksStore from '../../../data/stores/UseTasksStore';
import UseUserStore from '../../../data/stores/UseUserStore';
import TopExecutorListSkileton from '../../../components/Tasks/TopExecutorListSkileton';

const tasks = () => {
  const router = useRouter();
  const pageUrl = router.query.pages;
  const { user, refreshToken } = UseUserStore((state) => state);
  const { getTasksAll, loading } = UseTasksStore((state) => state);
  const [isAuth, setIsAuth] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lengthTasks, setLengthTasks] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  let totalPage = Math.ceil(lengthTasks / limit);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getTasksAll({ category: selectedCategory, limit, page, price: selectedPrice });
      setLengthTasks(result?.tasksCount);
      setTasks(result?.tasks);
    };
    fetchData();
  }, [selectedCategory, selectedPrice, page]);

  useEffect(() => {
    if (pageUrl) {
      setPage(Number(pageUrl));
    }
  }, [pageUrl]);

  function handlePageChange(value) {
    if (value === '&lsaquo;' || value === '... ') {
      if (page > 1) {
        setPage(page - 1);
      }
    } else if (value === '&rsaquo;' || value === '... ') {
      if (page < totalPage) {
        setPage(page + 1);
      }
    } else {
      setPage(value);
    }
  }
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

  if (!user) {
    return <Loading />;
  }

  return (
    <MainContainer title="Всё задачи">
      <Header />
      <section className="top-executor">
        <div className="top-executor__container">
          <h2 className="top-executor__title">Топ исполнителей</h2>
          {user?.plan === 'BASIC' ? <TopExecutorListBlur /> : <TopExecutorList />}
        </div>
      </section>
      <section className="tasks">
        <div className="tasks__container">
          <h2 className="tasks__title">
            Всего задач <span className="tasks__title-count">{lengthTasks}</span>
          </h2>
          <div className="tasks__body">
            <Filter
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
            {tasks.length === 0 ? (
              <h2 className="top-executor__title">Ничего не найдено</h2>
            ) : (
              <div className="tasks__wrapper">
                {loading ? <p className="tasks__loading">Загрузка...</p> : <TasksList tasks={tasks} user={user?.name} />}
                {totalPage > 1 && <Pagination page={page} limit={limit} totalPage={totalPage} sibling={1} onPageChange={handlePageChange} />}
              </div>
            )}
          </div>
        </div>
        <Link className="menu__link-button button button--full" href="/create-task">
          <img src="/plus-white.svg" alt="" />
        </Link>
      </section>
    </MainContainer>
  );
};

export default tasks;
