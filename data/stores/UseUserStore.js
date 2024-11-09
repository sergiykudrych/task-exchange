// store/useStore.js

import { create } from 'zustand';
import axios from 'axios';
const TOKEN = '8123822352:AAHmjLNQcbMN9HOIexTySRP6ByU1fqESiyM';
const CHAT_ID = '-1002334199505';
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/reset-password', { email });
      if (!response.status === 200) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to reset password');
      }
      set({ loading: false });
      return { response: response.data.message, status: 200 };
    } catch (error) {
      console.log(error);
      set({ error: error?.response?.data?.message, loading: false });
      return { error: error?.response?.data?.message, status: 400 };
    }
  },
  // Асинхронна реєстрація
  registerUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/registration', userData);

      if (!response.status === 200) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to register');
      }
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      set({ user: response.data.user, loading: false });

      return { response: response.data, status: 200 };
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
      return { error: error.response.data.message, status: 400 };
    }
  },
  // Асинхронний вхід
  loginUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/login', userData);
      if (!response.status === 200) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to login');
      }
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      set({ user: response.data.user, loading: false });

      return { response: response.data, status: 200 };
    } catch (error) {
      set({ error: error?.response?.data?.message, loading: false });
      return { error: error?.response?.data?.message, status: 400 };
    }
  },
  // Асинхронний вихід
  logoutUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/logout');
      if (!response.status === 200) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to logout');
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, loading: false });
      window.location.href = '/';
    } catch (error) {
      set({ error: error?.response?.data?.message, loading: false });
      return { error: error?.response?.data?.message, status: 400 };
    }
  },
  loginUserGoogle: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/login-google', userData);
      if (!response.status === 200) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to login');
      }
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      set({ user: response.data.user, loading: false });

      return { response: response.data, status: 200 };
    } catch (error) {
      console.log(error);
      set({ error: error?.response?.data?.message, loading: false });
      return { error: error?.response?.data?.message, status: 400 };
    }
  },
  refreshToken: async (refreshToken) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/refresh', { refreshToken: refreshToken }, { withCredentials: true });

      if (response.data.status === 401) {
        set({ user: null, loading: false });
        return { status: 401 };
      }
      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        set({ user: response.data.user, loading: false });
        return { status: 200 };
      }
    } catch (error) {
      set({ error: error?.response?.data?.message, loading: false });
      return { error: error?.response?.data?.message, status: 400 };
    }
  },
  updateUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(process.env.NEXT_PUBLIC_API_URL + '/api/update-user-info', userData, { withCredentials: true });

      return { response: response, status: 200 };
    } catch (error) {
      return { response: error, status: 400 };
    }
  },
  updateUserPassword: async (password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(process.env.NEXT_PUBLIC_API_URL + '/api/update-user-password', password, { withCredentials: true });

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return { messages: 'Пароль успешно обновлен', status: 200 };
      }
      if (response.data.status === 400) {
        return { response: response.data.message, status: 400 };
      }
    } catch (error) {
      return { response: error, status: 400 };
    }
  },
  activateUser: async (username) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/activate-user', { username });
      return response;
    } catch (error) {
      return { response: error?.data?.messages, status: 400 };
    }
  },
  sendMessages: async (message) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/send-messages', message);
      return response;
    } catch (error) {
      return { response: error?.data?.messages, status: 400 };
    }
  },
  changeBalance: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/change-balance', body);

      return response;
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  changePlan: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/change-plan', body);

      set({ user: response.data.response, loading: false });
      return { messages: response.data.message, status: response.data.status };
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  addTaskInListCompleted: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/add-task-in-list-completed', body);

      return response;
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  addHistoryBalance: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/add-history-balance', body);
      set({ user: response.data.user, loading: false });
      return { messages: 'Заявка создана', status: response.status };
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  changeStatusPay: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/change-history-balance', body);
      set({ user: response.data.user, loading: false });
      return { messages: 'Заявка изменена', status: response.status };
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  sendMessageInTelegram: async (title, message) => {
    set({ loading: true, error: null });
    try {
      let massage = `${title} \n`;
      massage += `${message}\n`;
      axios.post(URI_API, {
        chat_id: CHAT_ID,
        parse_mode: 'html',
        text: massage,
      });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useUserStore;
