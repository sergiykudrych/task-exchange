import React from 'react';

const HeaderMessages = ({ messages }) => {
  return (
    <ul className="message-menu__list">
      {messages &&
        messages.map((message, index) => (
          <li className="message-menu__item" key={index}>
            <div className="message-menu__item-top">
              <img
                src={
                  (message.status === 'error' && '/error.svg') ||
                  (message.status === 'success' && '/done.svg') ||
                  (message.status === 'waiting' && '/message-orange.svg') ||
                  (message.status === 'information' && '/message-orange.svg')
                }
                alt=""
              />
              <h3 className="message-menu__item-title">{message.title}</h3>
              <p className="message-menu__item-time">{message.time}</p>
            </div>

            <p className="message-menu__item-text">{message.text}</p>
          </li>
        ))}
    </ul>
  );
};

export default HeaderMessages;
