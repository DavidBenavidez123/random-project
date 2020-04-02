import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import socketIOClient from "socket.io-client";
import { Link, browserHistory } from 'react-router-dom'
import { Input } from 'semantic-ui-react'
import axios from 'axios'
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatMessages from './ChatMessages'
import { css } from 'glamor';

const ROOT_CSS = css({
    height: 560,
});


function Chat(props) {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const socketRef = useRef();
    useEffect(() => {
        firstLoad()
        socketRef.current = socketIOClient('http://localhost:5000')
        loadMessages()
        return () => {
            socketRef.current.disconnect();
        }
    }, [])

    const sendMessages = () => {
        const users_id = props.user.user_id
        const username = props.user.userName
        const data = { message, users_id, username }
        socketRef.current.emit("sending message", data)
        setMessage('')
    }

    const firstLoad = () => {
        axios.get('http://localhost:5000/api/message')
            .then(res => {
                console.log('loading message')
                setMessages(res.data.messages)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const loadMessages = () => {
        socketRef.current.on("sending message", (message) => {
            setMessages(newMessage => [...newMessage, message])
        })
    }

    return (
        <div className="Chat">
            Chat
            <div className="messages-scroll">
                <ScrollToBottom className={ROOT_CSS}>
                    {messages.map((message, id) => (
                        <ChatMessages key={id} message={message} sentByUser={message.users_id === props.user.user_id} />
                    )
                    )}
                </ScrollToBottom>
            </div>

            <div className="Messages-Text-Box">
                <textarea
                    id="story"
                    value={message}
                    name='description'
                    onChange={(event) => { setMessage(event.target.value) }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && message.length && !event.shiftKey) {
                            sendMessages()
                        }
                    }}
                >
                </textarea>
                <section className="attachment-container">

                </section>
            </div>
        </div>
    );
}

export default Chat;
