import React, { useState } from 'react';
import './Login.css';
import { useHistory } from 'react-router-dom';
import { Link, } from 'react-router-dom'
import { Input, Form, Label, Loader } from 'semantic-ui-react'
import axios from 'axios'

function Login(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const [emptyNameText, setEmptyNameText] = useState('')
    const [emptyNameErr, setEmptyNameErr] = useState(false)
    const [emptyPasswordErr, setemptyPasswordErr] = useState(false)
    const [emptyPasswordText, setemptyPasswordText] = useState('')
    const [loginError, setLoginError] = useState(false)
    const [loginButton, setloginButton] = useState('Login')

    const history = useHistory();
    const login = () => {
        const err = fieldCheck()
        if (err) {
            setloginButton('')
            const data = { username, password }
            axios.post('https://chat-backend-1.herokuapp.com/api/user/login', data)
                .then(response => {
                    if (response.data.message) {
                        setLoginError(true)
                        setloginButton('Login')
                    }
                    else {
                        localStorage.setItem('jwt', response.data.token);
                    }
                    props.getUserData()
                })
                .catch(() => {
                    setloginButton('Login')
                    setErr({ err: 'Error' })
                })
        }
    }

    console.log(loginError)
    const fieldCheck = () => {
        let isError = false
        if (!username.length) {
            setEmptyNameText('Username cannot be empty')
            setEmptyNameErr(true)
        }
        else {
            setEmptyNameText('')
            setEmptyNameErr(false)
        }
        if (!password.length) {
            setemptyPasswordText('Password cannot be empty')
            setemptyPasswordErr(true)
        }
        else {
            setemptyPasswordText('')
            setemptyPasswordErr(false)
        }

        if (username.length && password.length) {
            isError = true
        }
        return isError
    }

    return (
        <div className="register">
            <div className="register-content">
                <h1 className='heading'>
                    Login
                </h1>
                <Form>
                    <Form.Field error={(emptyNameErr || loginError)}>
                        {
                            (emptyNameErr) &&
                            <Label basic color='red' pointing='below'>{emptyNameText}</Label>
                        }
                        <Input placeholder='username' className='joinInput' onChange={(event) => { setUsername(event.target.value) }} />
                    </Form.Field>
                    <Form.Field error={emptyPasswordErr || loginError}>
                        {
                            (emptyPasswordErr) &&
                            <Label basic color='red' pointing='below'>{emptyPasswordText}</Label>
                        }
                        <Input placeholder='Password' className='joinInput mt-20' type='password' onChange={(event) => { setPassword(event.target.value) }} />
                    </Form.Field>
                    {
                        (loginError) &&
                        <Label basic color='red' pointing>Username/Password is incorrect</Label>
                    }
                </Form>

                {loginButton.length ? (
                    <button onClick={login} className="register-button" type="submit">
                        {loginButton}
                    </button>
                ) : (
                        <div className='loader'>
                            <Loader active />
                        </div>
                    )}

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
