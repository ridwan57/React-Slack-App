import React from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from '../../firebase/firebase'
import FileModal from "./FileModal";
class MessageForm extends React.Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })


    }
    openModal = () => {
        this.setState({ modal: true })
    }
    closeModal = () => {
        this.setState({ modal: false })
    }
    createMessage = () => {
        const { user } = this.state;
        const message = {
            content: this.state.message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            }
        }
        return message
    }
    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if (message) {
            this.setState({ loading: true })
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '' })

                })
                .catch((err) => {
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })

                });


        }
        else {
            this.setState({
                errors: this.state.errors.concat(({ message: 'Add a message' }))
            })
        }
    }
    uploadFile = (file, metadata) => {
        console.log('file,metadata:', file, metadata)
    }
    render() {
        const { errors, message, loading, modal } = this.state;
        return (
            <Segment className="message__form">
                <Input
                    fluid
                    name="message"
                    style={{ marginBottom: "0.7em" }}
                    label={<Button icon={"add"} />}
                    labelPosition="left"
                    placeholder="Write your message"
                    onChange={this.handleChange}
                    value={message}
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }
                />
                <Button.Group icon widths="2">
                    <Button
                        disabled={loading}
                        onClick={this.sendMessage}
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />
                    <Button
                        onClick={this.openModal}
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                    <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                        openModal={this.openModal}
                        uploadFile={this.uploadFile}
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessageForm;
