import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from '../../firebase/firebase'
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messagesLoading: true,
        messages: [],
        progressBar: false,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.addListners(channel.id)
        }
    }
    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;
        return privateChannel ? privateMessagesRef : messagesRef
    }

    addListners = (channelId) => {
        this.addMessageListner(channelId);

    }
    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }
    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages]

        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
                acc.push(message)
            }
            return acc
        }, [])

        this.setState({ searchResults })
        setTimeout(() => this.setState({ searchLoading: false }), 1000)
    }
    addMessageListner = channelId => {
        let loadMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadMessages.push(snap.val())
            // console.log(loadMessages)
            this.setState({
                messages: loadMessages,
                messagesLoading: false
            })
        })
        this.countUniqueUsers(loadMessages)
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
    isProgressBarVisible = (percent) => {
        if (percent > 0) {
            this.setState({ progressBar: true })
        }
    }


    displayChannelName = (channel) => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''

    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }
            return acc
        }, [])

        const numUniqueUsers = `${uniqueUsers.length} users`;
        this.setState({
            numUniqueUsers
        })
    }

    render() {
        const { privateChannel, searchTerm, searchResults, messagesRef, channel, user, messages, messagesLoading, progressBar, numUniqueUsers, searchLoading } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader

                    handleSearchChange={this.handleSearchChange}
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                />

                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : "messages"}>

                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    isPrivateChannel={privateChannel}
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                    getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        );
    }
}

export default Messages;
