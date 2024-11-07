import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import TasksList from '../components/Tasks/TasksList';
import Loading from '../components/Loading';

import useUserStore from '../data/stores/UseUserStore';
const CompleteTasks = () => {
  const router = useRouter();
  const { user, refreshToken } = useUserStore((state) => state);

  const handleAuth = async (Token) => {
    try {
      const responce = await refreshToken(Token);
      console.log(responce);
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
      <MainContainer title={'Завершенные задачи'}>
        <Header />
        <div className="complete-tasks">
          <div className="complete-tasks__container">
            {user?.completeTasks.length > 0 ? (
              <>
                <h1 className="complete-tasks__title">Завершенные задачи</h1>
                {<TasksList tasks={user?.completeTasks} user={user} />}
              </>
            ) : (
              <h1 className="complete-tasks__title">Нет завершенных задач</h1>
            )}
          </div>
        </div>
      </MainContainer>
    </>
  );
};

export default CompleteTasks;
