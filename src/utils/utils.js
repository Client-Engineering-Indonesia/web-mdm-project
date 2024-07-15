import axios from 'axios';


// const url = 'http://127.0.0.1:5000';
const url = 'http://52.118.170.239:8443';


export const fetchToken = async () => {
    try {
        const response = await axios.post(`${url}/get_token`);
        var token = response.data.token;
        return token; 
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
  };
  