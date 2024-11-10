import React, { useEffect } from 'react';

import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import TasksList from '../components/Tasks/TasksList';
import Loading from '../components/Loading';

const CompleteTasks = ({ user }) => {
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
