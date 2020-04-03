import React, { useState } from 'react';
import './Header.css';


function Login(props) {

    const logout = () => {
        localStorage.clear('jwt')
        window.location.reload();
    }
    return (
        <div className="Header">
            <div className='logout-header'>
                <p onClick={logout}>
                    logout
                </p>
            </div>
        </div>
    );
}

export default Login;
