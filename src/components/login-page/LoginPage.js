import './LoginPage.css'
import { React, useState} from 'react';
import {  Button, Search, Dropdown, IconButton, Pagination, Modal, Select, SelectItem, TextInput
} from '@carbon/react';

export default function LOGIN () {
    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='login-title'>
                    <p>Log In</p>
                </div>
                <div className='login-form'>
                    <div className='login-input'>
                        <TextInput
                            id='username'
                            labelText='Username'
                            placeholder='Enter your username'
                            required
                        />
                    </div>
                    <div className='login-input'>
                        <TextInput
                            id='password'
                            labelText='Password'
                            placeholder='Enter your password'
                            type='password'
                            required
                        />
                    </div>
                    <div className='login-button'>
                        <Button size='lg' className='button' kind="primary">Login</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
