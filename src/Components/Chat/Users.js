import React, { useState, useEffect } from 'react';
import './Chat.css';
import { Link } from 'react-router-dom'
import axios from 'axios'

function Users(props) {

    return (
        <div>
            <p>
            {props.user.username}
            </p>
        </div>
    );
}

export default Users;
