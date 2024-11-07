import { useEffect } from 'react';
import { useRouter } from 'next/router';

import MainContainer from '../components/MainContainer';
import HeaderMain from '../components/Home/HeaderMain';
import Main from '../components/Home/Main';
import Header from '../components/Works/Header';

import useUserStore from '../data/stores/UseUserStore';
import Footer from '../components/Home/Footer';
const Index = () => {
  const router = useRouter();
  const { user, refreshToken } = useUserStore((state) => state);
  const handleAuth = async (Token) => {
    try {
      const responce = await refreshToken(Token);
      if (responce.status === 200) {
        setIsAuth(true);
      } else {
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
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <MainContainer title={'Главная страница'}>
      <>
        {user ? <Header /> : <HeaderMain />}
        <Main link={user ? '/tasks/pages/1' : '/login'} />
        <Footer />
      </>
    </MainContainer>
  );
};

export default Index;
