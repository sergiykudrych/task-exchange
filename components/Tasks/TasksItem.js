import React from 'react';
import Link from 'next/link';

const TasksItem = ({ task, user }) => {
  return (
    <li className={task.inTop ? 'task-item task-item--top ' : 'task-item'}>
      <div className="task-item__top">
        <div className="task-item__top-icon">
          <img src="/star-white.svg" alt="Top task" />
        </div>
        <Link href={'/task/' + task.id} className="task-item__top-link">
          {task.title}
        </Link>
        <p className="task-item__top-price">{task.priceOneTask} $</p>
      </div>
      <p className="task-item__description">{task.description}</p>
      <div className="task-item__bottom">
        {user === task.creator ? (
          <Link href="/profile" className="task-item__bottom-customer">
            {task.creator}
          </Link>
        ) : (
          <Link href={'/user/' + task.creator} className="task-item__bottom-customer">
            {task.creator}
          </Link>
        )}
      </div>
    </li>
  );
};

export default TasksItem;
