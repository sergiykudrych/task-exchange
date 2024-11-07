import { create } from 'zustand';
import axios from 'axios';

const useFeedBackStore = create((set, get) => ({
  feedbacks: null,
  loading: false,
  error: null,
  getFeedbacks: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/get-feedbacks', { params: { user: body } });
      if (!response.status === 200) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to get top executor');
      }
      set({ feedbacks: response.data, loading: false });
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  getFeedbacksAll: async (body) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/get-feedbacks', { params: { user: body } });

      if (!response.status === 200) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to get top executor');
      }
      set({ feedbacks: response.data, loading: false });
    } catch (error) {
      set({ error: error.response.data.message, loading: false });
    }
  },
  feedbackSend: async (message) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/send-feedback', message);
      set({ feedbacks: response.data.feedbacks, loading: false });
      return response;
    } catch (error) {
      return { response: error?.data?.messages, status: 400 };
    }
  },
  changeStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/change-feedback', { id, status });
      return response;
    } catch (error) {
      return { response: error?.data?.messages, status: 400 };
    }
  },
}));

export default useFeedBackStore;
