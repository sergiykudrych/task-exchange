import Link from 'next/link';
import React from 'react';

const HeaderLinks = ({ logoutUser, user }) => {
  return (
    <ul className="profile-menu__links">
      <li>
        <Link href="/change-plan">
          <img src="/header/plan.svg" alt="" />
          Сменить план
        </Link>
      </li>
      <li>
        <Link href="/my-balance">
          <img src="/header/money.svg" alt="" />
          Мой баланс
        </Link>
      </li>
      <li>
        <Link href="/profile">
          <img src="/header/profile.svg" alt="" />
          Профиль
        </Link>
      </li>
      <li>
        <Link href="/messages">
          <img src="/header/message.svg" alt="" />
          Сообщения
        </Link>
        {user?.messages && user?.messages.length > 0 && <span className="profile-menu__links-count">{user?.messages.length}</span>}
      </li>
      <li>
        <Link href="/my-tasks">
          <img src="/header/task.svg" alt="" />
          Мои задания
        </Link>
      </li>
      <li>
        <Link href="/complete-tasks">
          <img src="/header/task-done.svg" alt="" />
          Исполненые задания
        </Link>
      </li>
      <li>
        <Link href="/feedback">
          <img src="/header/feedback.svg" alt="" />
          Служба поддержки
        </Link>
      </li>
      {user?.role === 'ADMIN' && (
        <>
          <li>
            <Link href="/statistics">
              <img src="/header/statictic1.svg" alt="" />
              Статистика
            </Link>
          </li>
          <li>
            <Link href="/send-message">
              <img src="/header/message-send.svg" alt="" />
              Отправить сообщение
            </Link>
          </li>
          <li>
            <Link href="/all-tasks">
              <img src="/header/task.svg" alt="" />
              Всё задания
            </Link>
          </li>
          <li>
            <Link href="/add-category">
              <img src="/header/category.svg" alt="" />
              Добавить категорию
            </Link>
          </li>
        </>
      )}
      <hr />
      <li>
        <button className="profile-menu__logout" onClick={logoutUser}>
          <img src="/header/exit.svg" alt="" />
          Выйти
        </button>
      </li>
    </ul>
  );
};

export default HeaderLinks;
