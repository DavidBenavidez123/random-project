import React, { useState } from 'react';
import './Chat.css';
import { Link } from 'react-router-dom'
import axios from 'axios'

function Rooms(props) {


    return (
        <Link to={`/${props.room.name}`} >
            <div className="room">
                <p>
                    #{props.room.name}
                </p>
            </div>
        </Link >
    );
}

export default Rooms;
