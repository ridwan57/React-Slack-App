import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from '../../firebase/firebase'
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messagesLoading: true,
        messages: []
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.addListners(channel.id)
        }
    }

    addListners = channelId => {
        this.addMessageListner(channelId);
    }
    addMessageListner = channelId => {
        let loadMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadMessages.push(snap.val())
            console.log(loadMessages)
            this.setState({
                messages: loadMessages,
                messagesLoading: true
            })
        })
    }
    displayMessages = (messages) => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}

            />
        ))
    )
    render() {
        const { messagesRef, channel, user, messages, messagesLoading } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">

                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm messagesRef={messagesRef} currentChannel={channel} currentUser={user} />
            </React.Fragment>
        );
    }
}

export default Messages;
