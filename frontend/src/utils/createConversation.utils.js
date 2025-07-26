import api from "../api/ax";


export const createConversation = async (data) => {
    try {
        const response = await api.post('/api/conversation', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
