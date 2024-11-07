import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainContainer from '../components/MainContainer';
import Header from '../components/Works/Header';
import axios from 'axios';
import Loading from '../components/Loading';
import useUserStore from '../data/stores/UseUserStore';
import Link from 'next/link';

const FailedPayment = () => {
  const { user, refreshToken, changeStatusPay } = useUserStore((state) => state);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [inv, setInv] = useState('');
  const handleAuth = async (Token) => {
    try {
      const response = await refreshToken(Token);
      if (response.status === 200) {
        setIsAuth(true);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Authorization error:', error);
      router.push('/login');
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        handleAuth(refreshToken);
      } else {
        router.push('/login');
      }
    }
  }, [isMounted]);

  const checkPayment = async () => {
    try {
      const INV = localStorage.getItem('invoiceId');
      setInv(INV);
      if (!INV) {
        router.push('/');
        return;
      }
      const uuids = [INV];
      const response = await axios.post(
        'https://api.cryptocloud.plus/v2/invoice/merchant/info',
        { uuids },
        {
          headers: {
            Authorization: 'Token ' + process.env.NEXT_PUBLIC_TOKEN_CRYPTO,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status !== 'success') {
        const result2 = await changeStatusPay({ name: user.name, hash: INV, status: 'error' });
        if (result2.status === 200) {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Payment check error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      checkPayment();
    }
  }, [isAuth]);

  if (loading) {
    return <Loading />;
  }
  return (
    <MainContainer title="Произошла ошибка при оплате">
      <Header />
      <div className="successful-payment">
        <div className="successful-payment__image">{loading ? <img src="/wait.png" alt="Loading" /> : <img src="/error.svg" alt="Error" />}</div>
        <h1 className="successful-payment__title">{loading ? 'Проверка статуса оплаты...' : 'Произошла ошибка при оплате'}</h1>
        {!loading && (
          <p className="successful-payment__text">
            Сумма не была зачислена
            <br /> на ваш баланс
          </p>
        )}
        <br />
        {!loading && (
          <p className="successful-payment__text">
            Хеш инвойса <br /> #{inv}
          </p>
        )}
        {!loading && (
          <Link className="successful-payment__link button button--border" href="/support">
            Служба поддержки
          </Link>
        )}
      </div>
    </MainContainer>
  );
};

export default FailedPayment;
