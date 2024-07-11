import axios from 'axios';

const url1 = 'http://52.118.170.239:8443';
const url2 = 'http://127.0.0.1:5000'

export const fetchToken = async () => {
    try {
        const response = await axios.post(`${url2}/get_token`);
        var token = response.data.token;
        return token; 
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
  };
  