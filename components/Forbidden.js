import Link from 'next/link';
import React from 'react';

const Forbidden = ({ title }) => {
  return (
    <div className="forbidden">
      <div className="forbidden__container">
        <h1 className="forbidden__title">{title || 'Страница не найдена'}</h1>
        <Link className="forbidden__link" href="/tasks/pages/1">
          На главную
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
