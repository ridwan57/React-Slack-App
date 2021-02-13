import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from '../../firebase/firebase'
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
    state = {
        isChannelStarred: false,
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        usersRef: firebase.database().ref('users'),
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
    handleStar = () => {
        this.setState((prevState) => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel())
    }
    starChannel = () => {
        const { user, channel, usersRef, isChannelStarred } = this.state;
        if (isChannelStarred) {
            usersRef
                .child(`${user.uid}/starred`)
                .update({
                    [channel.id]: {
                        name: channel.name,
                        details: channel.details,
                        createdBy: {
                            name: channel.createdBy.name,
                            avatar: channel.createdBy.avatar
                        }
                    }

                })
        }
        else {
            usersRef
                .child(`${user.uid}/starred`)
                .child(channel.id)
                .remove(err => {
                    if (err !== null) {
                        console.log(err)
                    }
                })
        }
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.addListners(channel.id)
            this.addUsersStarsListener(channel.id, user.uid)
        }
    }
    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;
        return privateChannel ? privateMessagesRef : messagesRef
    }

    addListners = (channelId) => {
        this.addMessageListner(channelId);

    }
    addUsersStarsListener = (channelId, userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val())
                    const prevStarred = channelIds.includes(channelId)
                    this.setState({ isChannelStarred: prevStarred })
                }
            })
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
        const { isChannelStarred, privateChannel, searchTerm, searchResults, messagesRef, channel, user, messages, messagesLoading, progressBar, numUniqueUsers, searchLoading } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
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
