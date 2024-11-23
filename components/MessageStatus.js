import React from 'react';

const MessageStatus = ({ show, status, text }) => {
  return (
    <div className={show ? 'message__popup active' : 'message__popup'}>
      <img src={status === 'success' ? '/confirmed.svg' : status === 'error' ? '/error.svg' : '/wait.png'} alt="" />
      <p className="message__popup-text">{text}</p>
    </div>
  );
};

export default MessageStatus;
