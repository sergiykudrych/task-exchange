import { create } from 'zustand';
import axios from 'axios';

const useTopExecutorStore = create((set, get) => ({
  topExecutor: null,
  loading: false,
  error: null,
  getTopExecutor: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/users-top-executor');
      if (!response.status === 200) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to get top executor');
      }
      set({ topExecutor: response.data, loading: false });
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  addTopExecutor: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/users-top-executor', body);
      set({ topExecutor: response.data, loading: false });
      return { messages: 'Успешно', status: 200 };
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
}));

export default useTopExecutorStore;
