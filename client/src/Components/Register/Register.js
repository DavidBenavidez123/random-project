import React, { useState } from 'react';
import './Register.css';
import socketIOClient from "socket.io-client";
import { Link, browserHistory } from 'react-router-dom'
import { Input } from 'semantic-ui-react'
import axios from 'axios'

function Join() {
    const [username, setsername] = useState('')
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')

    const login = () => {
        console.log('yes')
        const data = { username, email, password }
        axios.post('http://localhost:5000/api/user/register', data)
            .then(response => {
                console.log(response.data)
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
                    Register
                </h1>
                <div>
                    <Input placeholder='username' className='joinInput' type='text' onChange={(event) => { setsername(event.target.value) }} />
                </div>
                <div>
                    <Input placeholder='Email' className='joinInput mt-20' type='text' onChange={(event) => { setemail(event.target.value) }} />
                </div>
                <div>
                    <Input placeholder='Password' className='joinInput mt-20' type='text' onChange={(event) => { setPassword(event.target.value) }} />
                </div>

                <button onClick={login} className="register-button" type="submit">
                    Register
                </button>

                <div class="login">
                    <p>Have an account?</p>
                    <Link to="/Login">
                        <p>Login</p>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default Join;
