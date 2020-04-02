import React, { Component } from "react";

export default class MessageList extends Component {

    render() {
        return (
            <div className={(this.props.sentByUser) ? 'User-Own-Message' : 'User-Recipient-Message'}>

                <h3>
                {this.props.message.username}
                </h3>
                <p>
                {this.props.message.message}
                </p>
                
            </div>

        );
    }
}
