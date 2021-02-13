import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react'
import firebase from '../../firebase/firebase'
import { setCurrentChannel, setPrivateChannel } from '../../actions/index'
class Channels extends Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        firstLoad: true,
        activeChannel: ''
    }

    componentDidMount() {
        this.addListener()
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    closeModal = () => { this.setState({ modal: false }) }
    openModal = () => { this.setState({ modal: true }) }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault()
        if (this.isFromValid(this.state)) {

            this.addChannel();
            console.log('channel added')
        }
        else {
            console.log('Form invalid')
        }
    }

    addListener = () => {
        let loadedChannels = []
        this.state.channelsRef.on('child_added', snap => {

            loadedChannels.push(snap.val())
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel())
        })

    }

    setActiveChannel = channe => {
        this.setState({ activeChannel: channe.id })
    }


    setFirstChannel = () => {

        const { firstLoad, channels } = this.state;
        const firstChannel = channels[0]

        if (firstLoad && channels.length > 0) {
            this.props.setCurrentChannel(firstChannel)
            this.setActiveChannel(firstChannel)
        }
        this.setState({ firstLoad: false })


    }

    removeListeners = () => {
        this.state.channelsRef.off();
    };

    addChannel = () => {
        const { channelsRef, channelDetails, channelName, user } = this.state

        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }
        channelsRef.child(key).update(newChannel)
            .then(() => {
                this.setState({ channelDetails: '', channelName: '' })
                this.closeModal()

            })
            .catch(err => { console.log(err) })
    }
    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={this.state.activeChannel === channel.id}
            >
                #{channel.name}


            </Menu.Item>
        ))
    )
    changeChannel = channel => {
        this.props.setCurrentChannel(channel)
        this.setActiveChannel(channel);
        this.props.setPrivateChannel(false)
    }

    isFromValid = ({ channelName, channelDetails }) => channelName && channelDetails
    render() {
        const { channels, modal, channelDetails, channelName, user } = this.state;
        return (
            <>
                <Menu.Menu className='menu'>
                    <Menu.Item>
                        <span>
                            <Icon name='exchange' />
                        CHANNELS
                    </span>
                  ({channels.length}) <Icon onClick={this.openModal} name='add' />
                    </Menu.Item>
                    {this.displayChannels(channels)}

                </Menu.Menu>

                {/* {Add a channel} */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of channel"
                                    name='channelName'
                                    onChange={this.handleChange}
                                    value={channelName}
                                />
                                <Input
                                    fluid
                                    label="About the channel channel"
                                    name='channelDetails'
                                    onChange={this.handleChange}
                                    value={channelDetails}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='green' inverted>
                            <Icon name='checkmark' onClick={this.handleSubmit} />Add
                        </Button>

                        <Button color='red' inverted onClick={this.closeModal}>
                            <Icon name='remove' />Cancel
                        </Button>
                    </Modal.Actions>

                </Modal>
            </>


        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels)