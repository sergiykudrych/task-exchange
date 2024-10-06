import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const MainContainer = ({ children, keywords }) => {
  return (
    <>
      <Head>
        <meta keywords={'sergiy ' + keywords}></meta>
        <title>Main page</title>
      </Head>
      <div>
        <Link href="/users">Users</Link>
        <Link href="/">Home</Link>
      </div>
      <div>{children}</div>
    </>
  );
};

export default MainContainer;
