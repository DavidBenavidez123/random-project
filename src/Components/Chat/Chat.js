import React, { useState, useEffect, useRef, } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './Chat.css';
import socketIOClient from "socket.io-client";
import { Input, Loader, Icon } from 'semantic-ui-react'
import axios from 'axios'
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatMessages from './ChatMessages'
import Picker from 'emoji-picker-react';
import Rooms from './Rooms'

function Chat(props) {
    let data = 0
    let location = useParams();
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [editInput, setEditInput] = useState(false)
    const socketRef = useRef();
    const [showEmoji, setShowEmoji] = useState(false);
    const [roomUsers, setRoomUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');

    let history = useHistory();
    useEffect(() => {
        socketRef.current = socketIOClient('http://localhost:5000')
        loadMessages()
        loadupdateMessages()
        loadDeleteMessages()
        recieveRoomUsers()
        joinRoom()
        joinRoomOn()
        loadRooms()
        loadEmittedRoom()
        return () => {
            socketRef.current.disconnect();
        }
    }, [])
    useEffect(() => {
        firstLoad()
    }, [location.room])

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

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message => message + emojiObject.emoji);
    }

    const joinRoom = () => {
        let room = location.room
        let name = props.user.userName
        socketRef.current.emit("joining room", { name, room })
    }

    const joinRoomOn = () => {
        socketRef.current.on("joining room", (name) => {
            console.log(name)
        })
    }

    const recieveRoomUsers = () => {
        socketRef.current.on("users room", (users) => {
            setRoomUsers(roomUser => [...roomUser, users])
        })
    }

    const sendMessages = () => {
        const users_id = props.user.user_id
        const username = props.user.userName
        const room_id = location.room
        const data = { message, users_id, username, room_id }
        socketRef.current.emit("sending message", data)
        setMessage('')
    }

    const loadMessages = () => {
        socketRef.current.on("sending message", (message) => {
            setMessages(newMessage => [...newMessage, message])
        })
    }

    const firstLoad = () => {
        axios.get(`http://localhost:5000/api/message/${location.room}/messages`)
            .then(res => {
                console.log('loading message', res.data)
                if (res.data.room) {
                    history.push('/Global')
                }
                else {
                    setMessages(res.data.messages)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const loadScroll = (data) => {
        setLoading(true)
        let scroll = document.querySelector('.css-y1c0xs')
        const room = location.room
        const offSet = { data, room }
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

    const addRoom = () => {
        socketRef.current.emit("adding room", name)
        setName('')
    }
    const loadEmittedRoom = () => {
        socketRef.current.on("adding room", (name) => {
            setRooms(room => [...room, name])
        })

    }

    const loadRooms = () => {
        axios.get(`http://localhost:5000/api/rooms/rooms`)
            .then(res => {
                setRooms(res.data)
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
        <div className='chat-container'>
            <div className='Sidebar'>
                <div className='add-room'>
                    <h2>
                        Add a room!
                    </h2>
                    <Input
                        onChange={(event) => { setName(event.target.value) }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && (name.replace(/\s/g, "") !== "") && !event.shiftKey) {
                                addRoom()
                                event.preventDefault();
                            }
                        }}
                    />
                </div>
                <div className='rooms'>
                    {rooms.map((room) => {
                        return <Rooms
                            key={room.room_id}
                            room={room}
                        />;
                    })}
                </div>
                <div className='users'>



                </div>
            </div>
            <div className="Chat">
                <div className="messages-scroll">
                    <div className='room-name'>
                        <p>
                            {location.room}
                        </p>
                    </div>

                    <ScrollToBottom className='chat-box'>
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
