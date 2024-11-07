import Link from 'next/link';
import React from 'react';

const TopExecutorListBlur = () => {
  return (
    <div className="top-executor__blur">
      <ul className="top-executor__list top-executor__list--blur">
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <img src="/icon-user.svg" alt="" />
            <div className="top-executor__item-name">
              <span>user</span>
              <span>user</span>
            </div>
          </div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link">Связаться </div>
          </div>
          <div className="top-executor__item-description">gmail@gmail.com</div>
        </li>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <img src="/icon-user.svg" alt="" />
            <div className="top-executor__item-name">
              <span>user</span>
              <span>user</span>
            </div>
          </div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link">Связаться </div>
          </div>
          <div className="top-executor__item-description">gmail@gmail.com</div>
        </li>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <img src="/icon-user.svg" alt="" />
            <div className="top-executor__item-name">
              <span>user</span>
              <span>user</span>
            </div>
          </div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link">Связаться </div>
          </div>
          <div className="top-executor__item-description">gmail@gmail.com</div>
        </li>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <img src="/icon-user.svg" alt="" />
            <div className="top-executor__item-name">
              <span>user</span>
              <span>user</span>
            </div>
          </div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link">Связаться </div>
          </div>
          <div className="top-executor__item-description">gmail@gmail.com</div>
        </li>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <img src="/icon-user.svg" alt="" />
            <div className="top-executor__item-name">
              <span>user</span>
              <span>user</span>
            </div>
          </div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link">Связаться </div>
          </div>
          <div className="top-executor__item-description">gmail@gmail.com</div>
        </li>
      </ul>

      <div className="top-executor__message">
        <p className="top-executor__message-text">
          Перейдите на тарифный план <span>PREMIUM</span> чтобы получить больше возможностей
        </p>
        <Link href="/change-plan" className="button button--full">
          Перейти
        </Link>
      </div>
    </div>
  );
};

export default TopExecutorListBlur;
