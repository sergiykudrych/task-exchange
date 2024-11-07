import Image from 'next/image';
import Link from 'next/link';
const Main = ({ link }) => {
  return (
    <main className="main-home">
      <div className="main-home__container">
        <div className="main-home__content">
          <h1 className="main-home__title">
            Заработок в Интернете <br /> без вложений
          </h1>
          <p className="main-home__text">Тысячи простых заданий с оплатой за деньги</p>
          <Link href={link || '/tasks/pages/1'} className="main-home__button button button--full button--big">
            Начать зарабатывать
          </Link>
        </div>
        <div className="main-home__image">
          <Image src="/main-image.jpg" width={300} height={300} alt="Главное изображение" priority />
        </div>
      </div>
    </main>
  );
};

export default Main;
