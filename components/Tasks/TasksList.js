import React from 'react';
import TasksItem from './TasksItem';

const TasksList = ({ tasks, user }) => {
  return (
    <ul className="tasks__list">
      {tasks?.map((task) => (
        <TasksItem key={task.id} task={task} user={user} />
      ))}
    </ul>
  );
};

export default TasksList;
