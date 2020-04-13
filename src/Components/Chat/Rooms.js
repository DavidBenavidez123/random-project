import React, { useState, useEffect } from 'react';
import './Chat.css';
import { Link } from 'react-router-dom'
import axios from 'axios'

function Rooms(props) {

    let user = props.users[props.room.name]
    if (user) {
        var usersNumber = user.length
    }
    else {
        var usersNumber = 0
    }

    return (
        <Link to={`/${props.room.name}`} >
            <div className="room">
                <p>
                    #{props.room.name}
                </p>
                <p>
                    Users: {usersNumber}
                </p>
            </div>
        </Link >
    );
}

export default Rooms;
