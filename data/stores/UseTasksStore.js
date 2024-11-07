import { create } from 'zustand';
import axios from 'axios';

const UseTasksStore = create((set, get) => ({
  tasks: null,
  tasksCount: null,
  loading: false,
  error: null,
  createTask: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/create-task', body);
      return response;
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  updateTask: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/update-task', body);
      return response;
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },

  getMyTasksAll: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/get-my-tasks/' + body);
      set({ tasks: response.data, loading: false });
    } catch (error) {
      // set({ error: error.response.data.message, loading: false });
    }
  },
  getTasksAll: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/get-tasks', {
        params: { category: body.category, limit: body.limit, page: body.page, price: body.price },
      });
      set({ loading: false, error: null });
      return response.data;
    } catch (error) {
      // set({ error: error.response.data.message, loading: false });
    }
  },
  getAllTasksAdmin: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/get-tasks-admin');
      set({ tasks: response.data.tasks, loading: false, error: null });
      return response.data.tasks;
    } catch (error) {
      // set({ error: error.response.data.message, loading: false });
    }
  },
  changeStatusTask: async (body) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/change-status-task', body);
      set({ tasks: response.data.task, loading: false, error: null });
      return response.data;
    } catch (error) {
      // set({ error: error.response.data.message, loading: false });
    }
  },
  getTask: async (body) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/task/${body.id}`);
      set({ loading: false, error: null });
      return res.data;
    } catch (error) {
      // set({ error: error.response.data.message, loading: false });
    }
  },
}));

export default UseTasksStore;
