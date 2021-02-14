import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';
import UserPanel from './UserPanel'
export default class SidePanel extends Component {

    render() {

        const { currentUser, primaryColor } = this.props;
        return (
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                style={{ background: primaryColor, fontsize: '1.2rem' }}
            >


                <UserPanel
                    primaryColor={primaryColor}
                    currentUser={currentUser}
                />
                <Starred currentUser={currentUser} />

                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />

            </Menu>

        )
    }
}

