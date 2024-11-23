import { create } from 'zustand';
import axios from 'axios';

const useCategoryStore = create((set, get) => ({
  categories: null,
  loading: false,
  error: null,
  getCategory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/category');
      set({ categories: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  addCategory: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/create-category', body);

      set({ categories: response.data.items, loading: false });
      return { messages: response.data.message, status: 200 };
    } catch (e) {
      console.log(e);
      set({ error: e, loading: false });
      return { error: e.response.data.message, status: 400 };
    }
  },
  removeCategory: async (_id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.delete(process.env.NEXT_PUBLIC_API_URL + '/api/remove-category/' + _id);

      set({ categories: response.data.items, loading: false });
      return { messages: 'Успешно удалено', status: 200 };
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
}));

export default useCategoryStore;
