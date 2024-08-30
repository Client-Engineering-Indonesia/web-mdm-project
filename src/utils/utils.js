import axios from 'axios';


// const url = 'http://162.133.113.20:8443';
const url = 'http://162.133.113.20:8443';


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
  