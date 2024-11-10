import MainContainer from '../components/MainContainer';
import HeaderMain from '../components/Home/HeaderMain';
import Main from '../components/Home/Main';
import Header from '../components/Works/Header';

import Footer from '../components/Home/Footer';
const Index = ({ user }) => {
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
