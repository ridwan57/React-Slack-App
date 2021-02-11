import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Grid, Header, Icon, Image, Menu } from 'semantic-ui-react'
import firebase from '../../firebase/firebase'
class UserPanel extends Component {
    state = {
        user: this.props.currentUser
    }


    dropDownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disable: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignOut}>Sign Out</span>
        }
    ]
    handleSignOut = () => {
        firebase.auth().signOut()
            .then((user) =>
                console.log('user:', user)
            )
            .catch(err =>
                console.log('err:', err)
            );
    }
    render() {
        const { user } = this.state;
        return (
            <Grid style={{ background: '#4c3c4c' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        <Header inverted floated='left' as='h2'>
                            <Icon name='code' />
                            <Header.Content>DevChat</Header.Content>
                        </Header>

                        <Header style={{ padding: '.25em' }} inverted as='h2'>

                            <Dropdown
                                trigger={
                                    <span>
                                        <Image src={user.photoURL} spaced="right" avatar />
                                        {user.displayName}
                                    </span>} options={this.dropDownOptions()} />
                        </Header>
                    </Grid.Row>

                </Grid.Column>
            </Grid>
        )
    }
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser

})
export default connect(mapStateToProps)(UserPanel)