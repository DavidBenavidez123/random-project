import React, { useState } from 'react';
import './Join.css';
import socketIOClient from "socket.io-client";
import { Link, browserHistory } from 'react-router-dom'
import axios from 'axios'

function Join() {
    const [name, setName] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const login = () => {
        console.log('yes')
        const data = { name, email, password }
        axios.post('http://localhost:5000/api/user/register', data)
            .then(response => {

                localStorage.setItem('token', response.data.token);
                
            })
            .catch(err => {
                err
            })
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className='heading'>
                    Register
                </h1>
                <div>
                    <input placeholder='Name' className='joinInput' type='text' onChange={(event) => { setName(event.target.value) }} />
                </div>
                <div>
                    <input placeholder='Room' className='joinInput mt-20' type='text' onChange={(event) => { setemail(event.target.value) }} />
                </div>

                <button onClick={login} className="button mt-20" type="submit">
                    Sign In
                </button>


            </div>

        </div>
    );
}

export default Join;
