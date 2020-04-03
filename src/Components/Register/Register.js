import React, { useState } from 'react';
import './Register.css';
import { Link, useHistory, withRouter } from 'react-router-dom'
import { Input, Label, Form } from 'semantic-ui-react'
import axios from 'axios'

function Register(props) {
    const [username, setUsername] = useState('')
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const [emailErr, setEmailErr] = useState('')
    const [nameErr, setNameErr] = useState('')
    const [emptyNameText, setEmptyNameText] = useState('')
    const [emptyNameErr, setEmptyNameErr] = useState(false)
    const [emptyEmailText, setEmptyEmailText] = useState('')
    const [emptyEmailErr, setEmptyEmailErr] = useState(false)
    const [emptyPasswordErr, setemptyPasswordErr] = useState(false)
    const [emptyPasswordText, setemptyPasswordText] = useState('')
    const [registerButton, setregisterButton] = useState('Register')
    let history = useHistory()

    const Register = (e) => {
        e.preventDefault();
        const data = { username, email, password }
        const err = fieldCheck()
        if (err) {
            setregisterButton('Registering...')
            axios.post('https://chat-backend-1.herokuapp.com/api/user/register', data)
                .then(response => {
                    console.log('response', response.data)
                    const error = response.data
                    if (error.user) {
                        history.push('/Login')
                    }
                    else {
                        setEmailErr(error.emailErr)
                        setNameErr(error.usernameErr)
                    }
                })
                .catch(() => {
                    console.log('loading')
                    setErr('Error')
                })
        }

    }

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
        if (email.indexOf('@') === -1) {
            setEmptyEmailText('This is not an email')
            setEmptyEmailErr(true)
        }
        else {
            setEmptyEmailText('')
            setEmptyEmailErr(false)
        }
        if (!password.length) {
            setemptyPasswordText('Password cannot be empty')
            setemptyPasswordErr(true)
        }
        else {
            setemptyPasswordText('')
            setemptyPasswordErr(false)
        }

        if (username.length && email.indexOf('@') !== -1 && password.length) {
            isError = true
        }
        return isError
    }

    return (
        <div className="register">
            <div className="register-content">
                <h1 className='heading'>
                    Register
                </h1>
                <Form autoComplete="off">
                    <Form.Field error={(nameErr || emptyNameErr)}>
                        {
                            (nameErr || emptyNameErr) &&
                            <Label basic color='red' pointing='below'>{emptyNameText || nameErr}</Label>
                        }
                        <Input placeholder='username' className='joinInput' type='text' onChange={(event) => { setUsername(event.target.value) }} />
                    </Form.Field>
                    <Form.Field error={emailErr || emptyEmailErr}>
                        {
                            (emailErr || emptyEmailErr) &&
                            <Label basic color='red' pointing='below'>{emailErr || emptyEmailText}</Label>
                        }
                        <Input placeholder='Email' error={emailErr} className='joinInput mt-20' type='email' onChange={(event) => { setemail(event.target.value) }} />
                    </Form.Field>
                    <Form.Field error={emptyPasswordErr}>
                        {
                            (emptyPasswordErr) &&
                            <Label basic color='red' pointing='below'>{emptyPasswordText}</Label>
                        }
                        <Input placeholder='Password' className='joinInput mt-20' type='password' onChange={(event) => { setPassword(event.target.value) }} />
                    </Form.Field>
                </Form>
                <button onClick={Register} className="register-button" type="submit">
                    {registerButton}
                </button>

                <div class="register">
                    <p>Have an account?</p>
                    <Link to="/Login">
                        <p>Login</p>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default withRouter(Register);
