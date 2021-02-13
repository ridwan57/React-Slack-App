import React, { Component } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../actions/index'

class Starred extends Component {
    state = {
        starredChannels: [],
        activeChannel: ''
    }



    displayChannels = starredChannels => (
        starredChannels.length > 0 && starredChannels.map(channel => (
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
    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id })
    }
    changeChannel = channel => {
        this.props.setCurrentChannel(channel)
        this.setActiveChannel(channel);

        this.props.setPrivateChannel(false)
        this.setState({ channel })
    }

    render() {
        const { starredChannels } = this.state
        return (
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='star' /> STARRED
            </span> {" "}
                    ({starredChannels.length})
                    <Icon onClick={this.openModal} name='add' />
                </Menu.Item>
                {this.displayChannels(starredChannels)}


            </Menu.Menu>
        )
    }
}

export default connect(null, {
    setPrivateChannel, setCurrentChannel
})(Starred)