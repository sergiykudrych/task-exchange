import Link from 'next/link';
import React from 'react';

const TopExecutorItem = ({ user }) => {
  return (
    <li className="top-executor__item">
      <div className="top-executor__item-top">
        <img src={user.image || '/icon-user.svg'} alt="" />
        <div>
          <Link href={'/user/' + user?.name} className="top-executor__item-name">
            {user?.name}
          </Link>
          <p className="top-executor__item-profession">{user?.profession}</p>
        </div>
      </div>
      <p className="top-executor__item-description">{user.about}</p>
      <div className="top-executor__item-bottom">
        <a href={'/' + user.contacts} className="top-executor__item-link">
          Связаться
        </a>
      </div>
      <a href={user.site !== null ? user.site : '/'} target="_blank" className="top-executor__item-site">
        {user.site}
      </a>
    </li>
  );
};

export default TopExecutorItem;
