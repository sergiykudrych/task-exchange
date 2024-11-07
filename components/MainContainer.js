import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const MainContainer = ({ children, keywords, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>{children}</div>
    </>
  );
};

export default MainContainer;
