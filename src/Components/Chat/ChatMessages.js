import React, { Component } from "react";
import Linkify from 'react-linkify';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import Picker from 'emoji-picker-react';

export default class MessageList extends Component {
    state = {
        edit: false,
        message: this.props.message.message,
        delete: false,
        modal: false,
        emoji: false,
    }

    onChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }

    changeEdit = e => {
        this.setState(prevState => ({
            edit: !prevState.edit
        }));
    }

    emojiToggle = e => {
        this.setState(prevState => ({
            emoji: !prevState.emoji
        }));
    }

    changeDelete = e => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    onEmojiClick = (event, emojiObject) => {
        this.setState({
            message: this.state.message + emojiObject.emoji
        })
    }

    render() {
        return (
            <div>
                <div className={(this.props.sentByUser) ? 'User-Own-Message' : 'User-Recipient-Message'}>
                    <h3>
                        {this.props.message.username}
                    </h3>
                    <Linkify>
                        {this.state.edit ? (
                            <textarea
                                onChange={this.onChange}
                                value={this.state.message}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && this.state.message.replace(/\s/g, "") !== "" && !event.shiftKey) {
                                        this.props.updateMessages(this.props.message.messages_id, this.state.message, this.props.index)
                                        this.setState({
                                            edit: false
                                        })
                                        event.preventDefault();
                                    }
                                }}
                            />
                        ) :
                            (
                                <p>
                                    {this.props.message.message}
                                </p>
                            )
                        }
                    </Linkify>
                    {this.props.sentByUser &&
                        <div className='edit-delete'>
                            {this.state.edit && this.props.editInput ? (
                                <div className="icon-cancel">
                                    <Icon onClick={this.emojiToggle} size='small' name='smile outline' />
                                    <h4 onClick={() => { this.changeEdit(); this.props.editMessageFalse() }}>
                                        Cancel
                                    </h4>
                                </div>
                            ) :
                                (
                                    <div>
                                        {this.props.editInput ?
                                            (
                                                <div>
                                                    <h4>
                                                        Edit
                                                    </h4>
                                                </div>
                                            ) :
                                            (
                                                <h4 onClick={() => { this.changeEdit(); this.props.editMessageTrue() }}>
                                                    Edit
                                                </h4>
                                            )
                                        }

                                    </div>
                                )
                            }


                            <h4 onClick={this.changeDelete}>
                                Delete
                            </h4>
                            {
                                this.state.emoji &&
                                <Picker preload={true} onEmojiClick={this.onEmojiClick} />
                            }


                            <Modal open={this.state.modal} basic size='small'>
                                <Header icon='delete' content='Are you sure you want to delete this message?' />
                                <Modal.Content>
                                    <p>
                                        {this.props.message.message}
                                    </p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.changeDelete} basic color='red' inverted>
                                        <Icon name='remove' /> No
                                      </Button>
                                    <Button onClick={() => { this.props.deleteMessages(this.props.message.messages_id); this.changeDelete(); }} color='green' inverted>
                                        <Icon name='checkmark' /> Yes
                                      </Button>
                                </Modal.Actions>
                            </Modal>
                        </div>
                    }

                </div>
            </div >
        );
    }
}
