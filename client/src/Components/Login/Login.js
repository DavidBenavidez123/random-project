import React, { useState } from 'react';
import './Login.css';
import socketIOClient from "socket.io-client";
import { Link, browserHistory } from 'react-router-dom'
import { Input } from 'semantic-ui-react'
import axios from 'axios'

function Login(props) {
    const [username, setsername] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')

    const login = () => {
        console.log('yes')
        const data = { username, password }
        axios.post('http://localhost:5000/api/user/login', data)
            .then(response => {
                localStorage.setItem('jwt', response.data.token);
                props.getUserData()
            })
            .catch(() => {
                setErr({ err: 'Error' })
            })
    }

    const fieldCheck = () => {

    }

    return (
        <div className="register">
            <div className="register-content">
                <h1 className='heading'>
                    Login
                </h1>
                <div>
                    <Input placeholder='username' className='joinInput' type='text' onChange={(event) => { setsername(event.target.value) }} />
                </div>

                <div>
                    <Input placeholder='Password' className='joinInput mt-20' type='text' onChange={(event) => { setPassword(event.target.value) }} />
                </div>

                <button onClick={login} className="register-button" type="submit">
                    Login
                </button>

                <div class="register">
                    <p>Don't have an account?</p>
                    <Link to="/Register">
                        <p>Signup</p>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default Login;
