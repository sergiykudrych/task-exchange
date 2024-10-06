import Link from 'next/link';
import React, { useState } from 'react';
import User from '../components/User';
import MainContainer from '../components/MainContainer';
const Users = ({ users }) => {
  return (
    <MainContainer>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>
              <User user={user} />
            </Link>
          </li>
        ))}
      </ul>
    </MainContainer>
  );
};

export default Users;

export async function getStaticProps(context) {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();
  return {
    props: { users },
  };
}
