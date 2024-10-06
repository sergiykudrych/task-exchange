import React from 'react';
import styles from '../styles/User.module.css';

const User = ({ user }) => {
  return <div className={styles.user}>User: {user.name}</div>;
};

export default User;
