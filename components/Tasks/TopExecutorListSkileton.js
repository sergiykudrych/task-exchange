import Link from 'next/link';
import React from 'react';

const TopExecutorListSkileton = () => {
  return (
    <div className="top-executor__skileton">
      <ul className="top-executor__list top-executor__list--skileton">
        <button className="top-executor__add">
          <img src="/plus.svg" alt="" />
          <p style={{ height: '20px', backgroundColor: '#e7e7e7', width: '100%', borderRadius: '10px' }}></p>
        </button>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <span className="top-executor__item-image"></span>
            <div className="top-executor__item-name">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link"> </div>
          </div>
          <div className="top-executor__item-description"></div>
        </li>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <span className="top-executor__item-image"></span>
            <div className="top-executor__item-name">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link"> </div>
          </div>
          <div className="top-executor__item-description"></div>
        </li>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <span className="top-executor__item-image"></span>
            <div className="top-executor__item-name">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link"> </div>
          </div>
          <div className="top-executor__item-description"></div>
        </li>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <span className="top-executor__item-image"></span>
            <div className="top-executor__item-name">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link"> </div>
          </div>
          <div className="top-executor__item-description"></div>
        </li>
        <li className="top-executor__item">
          <div className="top-executor__item-top">
            <span className="top-executor__item-image"></span>
            <div className="top-executor__item-name">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-description"></div>
          <div className="top-executor__item-bottom">
            <div className="top-executor__item-link"> </div>
          </div>
          <div className="top-executor__item-description"></div>
        </li>
      </ul>
    </div>
  );
};

export default TopExecutorListSkileton;
