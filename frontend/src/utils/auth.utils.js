import api from "../api/ax.js";
import * as SecureStore from 'expo-secure-store';


export const registerWithCredentials = async (data) => {
    try {
        const response = await api.post('/api/auth/register', data);
        console.log('Register response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Register error:', error.response?.data || error.message);
        throw error;
    }
};


export const loginWithCredentials = async (data) => {
    try {
        const response = await api.post('/api/auth/login', data);
        console.log('Login response:', response.data);
        await SecureStore.setItemAsync('token', response.data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

