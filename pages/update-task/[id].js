import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import MainContainer from '../../components/MainContainer';
import Header from '../../components/Works/Header';
import UseTasksStore from '../../data/stores/UseTasksStore';
import UseUserStore from '../../data/stores/UseUserStore';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import Select from 'react-select';
import Forbidden from '../../components/Forbidden';
import MessageStatus from '../../components/MessageStatus';

const UpdateTask = ({ user }) => {
  const router = useRouter();
  const { sendMessageInTelegram } = UseUserStore((state) => state);
  const { getTask, updateTask } = UseTasksStore((state) => state);

  const [task, setTask] = useState({
    title: '',
    category: '',
    link: '',
    description: '',
    infoCompleted: '',
  });
  const [categorySelect, setCategorySelect] = useState({});
  const heandlerNameTask = (e) => {
    if (e.length < 5) {
      document.querySelector('.new-task__message-name').classList.add('error');
      document.querySelector('.new-task__input-name').classList.add('error');
      document.querySelector('.new-task__button').classList.add('disabled');
    } else {
      document.querySelector('.new-task__button').classList.remove('disabled');
      document.querySelector('.new-task__message-name').classList.remove('error');
      document.querySelector('.new-task__input-name').classList.remove('error');
    }
    setTask({ ...task, title: e });
  };
  const heandlerLink = (e) => {
    if (e.length == 0) {
      document.querySelector('.new-task__button').classList.add('disabled');
      document.querySelector('.new-task__message-link').classList.add('error');
      document.querySelector('.new-task__input-link').classList.add('error');
    } else {
      document.querySelector('.new-task__button').classList.remove('disabled');
      document.querySelector('.new-task__message-link').classList.remove('error');
      document.querySelector('.new-task__input-link').classList.remove('error');
    }
    setTask({ ...task, link: e });
  };
  const heandlerDescription = (e) => {
    if (e.length < 5) {
      document.querySelector('.new-task__button').classList.add('disabled');
      document.querySelector('.new-task__message-description').classList.add('error');
      document.querySelector('.new-task__textarea-description').classList.add('error');
    } else {
      document.querySelector('.new-task__button').classList.remove('disabled');
      document.querySelector('.new-task__message-description').classList.remove('error');
      document.querySelector('.new-task__textarea-description').classList.remove('error');
    }
    setTask({ ...task, description: e });
  };
  const handlerInfoCompleted = (e) => {
    document.querySelector('.new-task__button').classList.remove('disabled');
    document.querySelector('.new-task__message-info-completed').classList.remove('error');
    document.querySelector('.new-task__textarea-info-completed').classList.remove('error');
    setTask({ ...task, infoCompleted: e });
  };
  const [categoryList, setCategoryList] = useState([
    {
      value: 'social',
      label: 'Соц сети',
    },
    {
      value: 'not-category',
      label: 'Без категории',
    },
  ]);
  const [messages, setMessages] = React.useState({
    text: '',
    status: '',
    show: false,
  });
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'lightgray' : 'white',
      color: 'black',
      cursor: 'pointer',
    }),
    control: (provided) => ({
      ...provided,
      boxShadow: 'none',
      cursor: 'pointer',
      borderRadius: 10,
    }),
  };

  const setCategory = (e) => {
    setCategorySelect(e);
    setTask({ ...task, category: e.value, categoryLabel: e.label });
  };
  useEffect(() => {
    const fetchData = async () => {
      if (router.query.id) {
        const result = await getTask({ id: router.query.id });
        setTask(result);
        setCategorySelect({
          value: result?.category,
          label: result?.categoryLabel,
        });
      }
    };
    fetchData();
  }, [router.query.id]);
  const updateTaskHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTask(task);
      let title = '<b> Обновление задания </b>\n';
      let message = 'Пользователь: <b>' + user?.name + '</b> обновил задание\n' + window.location.origin + '/all-tasks';
      await sendMessageInTelegram(title, message);
      setMessages({
        text: response?.data?.message,
        status: response?.data?.status === 200 ? 'success' : 'error',
        show: true,
      });

      // Таймер очистки сообщения
      setTimeout(() => {
        setMessages({
          text: '',
          status: '',
          show: false,
        });
        router.push('/my-tasks');
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  if (!user) {
    return <Loading />;
  }
  if (!task) {
    return <Loading />;
  }
  if (task.creator !== user.name) {
    return (
      <MainContainer title={'Нет прав для редактирования задачи'}>
        <Header />
        <Forbidden title={'Нет прав для редактирования задачи'} />
      </MainContainer>
    );
  }
  return (
    <>
      <MainContainer title={'Обновление задачи' + ' - ' + task?.title}>
        <Header />
        <div className="new-task update-task">
          <div className="new-task__container">
            <h1 className="new-task__title">Обновление задания</h1>
            <div className="new-task__body">
              <form className="new-task__form" onSubmit={updateTaskHandler}>
                <h2 className="new-task__body-title">Описание задание</h2>
                <label className="new-task__body-label">
                  <p>Название</p>
                  <input
                    className="new-task__input new-task__input-name"
                    type="text"
                    placeholder="Название задачи"
                    value={task.title}
                    onChange={(e) => heandlerNameTask(e.target.value)}
                  />
                  <span className="new-task__input-message new-task__message-name ">
                    Короткое название (5 символов минимум), передающее суть задания.
                  </span>
                </label>
                <label className="new-task__body-label">
                  <p>Категория</p>
                  <Select
                    value={categorySelect}
                    options={categoryList}
                    styles={customStyles}
                    onChange={setCategory}
                    instanceId="select-category"
                  ></Select>
                </label>
                <label className="new-task__body-label">
                  <p>Ссылка</p>
                  <input
                    className="new-task__input new-task__input-link"
                    type="text"
                    placeholder="https://"
                    value={task.link}
                    onChange={(e) => heandlerLink(e.target.value)}
                  />
                  <span className="new-task__input-message new-task__message-link">Ссылка на выполнение задания</span>
                </label>
                <label className="new-task__body-label">
                  <p>Описание</p>
                  <textarea
                    value={task.description}
                    onChange={(e) => heandlerDescription(e.target.value)}
                    className="new-task__textarea new-task__textarea-description"
                    placeholder="Распишите по пунктам, что нужно сделать в вашем задании."
                  ></textarea>
                  <span className="new-task__input-message new-task__message-description">
                    Распишите по пунктам, что должен сделать пользователь, не меньше 5 символов.
                  </span>
                </label>
                <h2 className="new-task__body-title">Проверка задание</h2>
                <label className="new-task__body-label">
                  <p>Информация для подтверждения</p>
                  <textarea
                    value={task.infoCompleted}
                    onChange={(e) => handlerInfoCompleted(e.target.value)}
                    className="new-task__textarea new-task__textarea-info-completed"
                    placeholder="Распишите по пунктам, какую информацию пользователь должен оставить в отчёте."
                  ></textarea>
                  <span className="new-task__input-message new-task__message-info-completed">
                    Напишите какую информацию пользователь должен оставить в отчёте, чтобы вы проверили правильность выполнения задания.
                  </span>
                </label>
                <div className="new-task__body-button">
                  <Link href="/my-tasks" className=" button button--cancel">
                    Отменить
                  </Link>
                  <button className="new-task__button button button--full">Обновить задание</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <MessageStatus show={messages.show} status={messages.status} text={messages.text} />
      </MainContainer>
    </>
  );
};

export default UpdateTask;
