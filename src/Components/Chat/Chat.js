import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './Chat.css';
import socketIOClient from "socket.io-client";
import { Input, Loader, Icon } from 'semantic-ui-react'
import axios from 'axios'
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatMessages from './ChatMessages'
import Picker from 'emoji-picker-react';


function Chat(props) {
    let data = 0
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [editInput, setEditInput] = useState(false)
    const socketRef = useRef();
    const [showEmoji, setShowEmoji] = useState(false);

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message => message + emojiObject.emoji);
    }

    useEffect(() => {
        firstLoad()
        socketRef.current = socketIOClient('http://localhost:5000')
        loadMessages()
        loadupdateMessages()
        loadDeleteMessages()
        return () => {
            socketRef.current.disconnect();
        }
    }, [])

    useEffect(() => {
        let scroll = document.querySelector('.css-y1c0xs')
        scroll.addEventListener('scroll', () => {
            let x = scroll.scrollTop
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


    const loadMessages = () => {
        socketRef.current.on("sending message", (message) => {
            setMessages(newMessage => [...newMessage, message])
        })
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

    const loadScroll = (data) => {
        setLoading(true)
        let scroll = document.querySelector('.css-y1c0xs')
        const offSet = { data }
        axios.post('http://localhost:5000/api/message/scroll', offSet)
            .then(res => {
                setLoading(false)
                scroll.scrollTop = 1
                setMessages(messages => [...res.data.messages, ...messages])
            })
            .catch(err => {
                console.log(err)
            })
    }

    const updateMessages = (id, text, created_at) => {
        const message = { id, text, created_at }
        socketRef.current.emit("updating message", message)
    }

    const loadupdateMessages = () => {
        socketRef.current.on("updating message", (message) => {
            const id = message.id
            const text = message.text
            setMessages(newMessage => {
                const messageArray = [...newMessage]
                messageArray.forEach(message => {
                    if (message.messages_id === id) {
                        message.message = text
                    }
                })
                return messageArray
            })
        })
    }

    const deleteMessages = (id) => {
        socketRef.current.emit("deleting message", id)
    }

    const loadDeleteMessages = () => {
        socketRef.current.on("deleting message", (message) => {
            const id = message
            setMessages(newMessage => newMessage.filter(message => message.messages_id !== id))
        })
    }


    const editMessagetoggle = () => {
        setEditInput(!editInput)
    }

    return (
        <div>
            <div className="Chat">
                <div className="messages-scroll">
                    <ScrollToBottom atTop={true} className='chat-box'>
                        {loading &&
                            <Loader active inline='centered' />
                        }
                        {messages.map((message, index) => {
                            return <ChatMessages
                                editMessagetoggle={editMessagetoggle}
                                index={index}
                                deleteMessages={deleteMessages}
                                updateMessages={updateMessages}
                                key={message.messages_id}
                                id={message.messages_id}
                                message={message} sentByUser={message.users_id === props.user.user_id}
                                editInput={editInput}
                            />;
                        })}
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
                            if (event.key === "Enter" && (message.replace(/\s/g, "") !== "") && !event.shiftKey) {
                                sendMessages()
                                event.preventDefault();
                            }
                        }}
                    >
                    </textarea>
                    <Icon onClick={() => { setShowEmoji(!showEmoji) }} size='large' name='smile outline' />
                    {
                        showEmoji &&
                        <Picker onEmojiClick={onEmojiClick} />
                    }
                </div>
            </div>
        </div>
    );
}



export default Chat;
