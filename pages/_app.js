import '../styles/global.css';
import '../styles/header.scss';
import '../styles/main.css';
import '../styles/auth.css';
import '../styles/header-work.scss';
import '../styles/tasks.scss';
import '../styles/pagination.scss';
import '../styles/top-execution.scss';
import '../styles/user.scss';
import '../styles/task.scss';
import '../styles/messages.scss';
import '../styles/profile.scss';
import '../styles/settings.scss';
import '../styles/my-tasks.scss';
import '../styles/complete-tasks.scss';
import '../styles/change-plan.scss';
import '../styles/my-balance.scss';
import '../styles/new-task.scss';
import '../styles/feedback.scss';
import '../styles/send-messages.scss';
import '../styles/add-category.scss';
import '../styles/successful-payment.scss';

import Head from 'next/head';
import Script from 'next/script';
import useUserStore from '../data/stores/UseUserStore';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
const MyApp = ({ Component, pageProps }) => {
  const { user, refreshToken } = useUserStore((state) => state);
  const router = useRouter();
  const handleAuth = async (Token) => {
    try {
      const responce = await refreshToken(Token);
      if (responce.status === 200) {
        setIsAuth(true);
      } else {
        localStorage.removeItem('refreshToken');
        router.push('/login');
      }
    } catch (error) {}
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        handleAuth(refreshToken);
      } else {
        router.push('/login');
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <>
      <Head>
        <title>Task Exchange</title>
      </Head>
      <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      <Component {...pageProps} user={user} />
    </>
  );
};

export default MyApp;
