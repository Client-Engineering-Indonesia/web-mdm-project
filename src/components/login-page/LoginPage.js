import './LoginPage.css'
import { React, useState, useEffect } from 'react';
import {  Button, Form, TextInput, Stack } from '@carbon/react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


const url = 'http://127.0.0.1:5000';
// const url = 'http://52.118.170.239:8443';


export default function LOGIN () {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
      });
    const [errors, setErrors] = useState({});
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        const loginData = {
            username: formData.username,
            password: formData.password
        };

        // console.log(loginData);

        try {
            const response = await fetch(`${url}/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            // console.log('Response:', response);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();

            Cookies.set('web_token', responseData.jwt_token, { expires: 7 });
            if (responseData.jwt_token) {
                // Decode the token
                const decoded = jwtDecode(responseData.jwt_token);
                // console.log(decoded)
                Cookies.set('cp4d_token', decoded.cp4d_token, { expires: 7 });
            }


            console.log('Response from server:', responseData);
            window.location.replace('/business_unit');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='login-title'>
                    <p>Log In</p>
                </div>
                <div className='login-form'>
                    <Form onSubmit={handleLogin}>
                        <Stack gap={5}>
                            <div className='login-input'>
                                <TextInput
                                    id='username'
                                    labelText='Username'
                                    placeholder='Enter your username'
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    invalid={!!errors.username}
                                    invalidText={errors.username}
                                    required
                                />
                            </div>
                            <div className='login-input'>
                                <TextInput
                                    id='password'
                                    labelText='Password'
                                    placeholder='Enter your password'
                                    type='password'
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    invalid={!!errors.password}
                                    invalidText={errors.password}
                                    required
                                />
                            </div>
                        </Stack>
                        
                        <div className='login-button'>
                            <Button size='lg' type="submit" className='button' kind="primary">Login</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
