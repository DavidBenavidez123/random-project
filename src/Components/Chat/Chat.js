import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './Chat.css';
import socketIOClient from "socket.io-client";
import { Input, Loader } from 'semantic-ui-react'
import axios from 'axios'
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatMessages from './ChatMessages'
import { css } from 'glamor';

const ROOT_CSS = css({
    height: 570,
});



function Chat(props) {
    let data = 0
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const socketRef = useRef();

    useEffect(() => {
        firstLoad()
        socketRef.current = socketIOClient('https://chat-backend-1.herokuapp.com/')
        loadMessages()
        return () => {
            socketRef.current.disconnect();
        }
    }, [])

    useEffect(() => {
        let scroll = document.querySelector('.css-y1c0xs')
        scroll.addEventListener('scroll', () => {
            let x = scroll.scrollTop
            console.log(x)
            if (x == 0) {
                setTimeout(() => {
                    loadScroll(data += 10)
                }, 500);
            }
        })
        return () => {
            scroll.removeEventListener('scroll', loadScroll);
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
        axios.get('https://chat-backend-1.herokuapp.com/api/message')
            .then(res => {
                console.log('loading message')
                setMessages(res.data.messages)
            })
            .catch(err => {
                console.log(err)
            })
    }



    const loadScroll = (data) => {
        setLoading(true)
        let scroll = document.querySelector('.css-y1c0xs')
        const offSet = { data }
        axios.post('https://chat-backend-1.herokuapp.com/api/message/scroll', offSet)
            .then(res => {
                setLoading(false)
                scroll.scrollTop = 10
                setMessages(messages => [...res.data.messages, ...messages])
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

    const logout = () => {
        localStorage.clear('jwt')
        window.location.reload();
    }

    return (
        <div>
            <div className='logout'>
                <p onClick={logout}>
                    logout
                </p>
            </div>

            <div className="Chat">
                <div className="messages-scroll">
                    <ScrollToBottom atTop={true} className='chat-box'>
                        {loading &&
                            <Loader active inline='centered' />
                        }
                        {messages.map((message, id) => (
                            <ChatMessages key={id} message={message} sentByUser={message.users_id === props.user.user_id} />
                        )
                        )}
                    </ScrollToBottom>
                </div>
                <div className="Messages-Text-Box">
                    <textarea
                        id="story"
                        placeholder='Say something...'
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
                </div>
            </div>
        </div>
    );
}



export default Chat;
