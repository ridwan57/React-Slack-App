import React from "react";
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from "semantic-ui-react";
import { SliderPicker } from 'react-color'
import firebase from '../../firebase/firebase'
class ColorPanel extends React.Component {
    state = {
        modal: false,
        primary: '',
        secondary: '',
        usersRef: firebase.database().ref('users'),
        user: this.props.currentUser
    }
    handleChangePrimary = (color) => {
        this.setState({ primary: color.hex })
    }
    handleSaveColors = () => {
        if (this.state.primary && this.state.secondary) {

            this.saveColors(this.state.primary, this.state.secondary)
        }
    }
    saveColors = (primary, secondary) => {
        this.state.usersRef
            .child(`${this.state.user.uid}/colors`)
            .push()
            .update({
                primary, secondary
            })
            .then(() => {
                console.log('Colors Added')
                this.closeModal()
            })
            .catch(err => {
                if (err !== null) {
                    console.log(err)
                }
            })


    }
    handleChangeSecondary = (color) => { this.setState({ secondary: color.hex }) }
    openModal = () => { this.setState({ modal: true }) }
    closeModal = () => { this.setState({ modal: false }) }
    render() {
        const { modal, primary, secondary } = this.state;

        return (

            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider />
                <Button icon="add" size="small" color="blue" onClick={this.openModal} />

                {/* color picker modal */}

                <Modal basic open={modal} onClose={this.closeModal}>

                    <Modal.Header>
                        Choose App Colors
                </Modal.Header>
                    <Modal.Content>
                        <Segment inverted >
                            <Label content="Primary color" />
                            <SliderPicker onChange={this.handleChangePrimary} color={primary} />

                        </Segment>
                        <Segment inverted >
                            <Label content="Secondary color" />
                            <SliderPicker onChange={this.handleChangeSecondary} color={secondary} />

                        </Segment>

                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted onClick={this.handleSaveColors}>
                            <Icon name='checkmark' /> Save Colors
                    </Button>
                        <Button color='red' inverted onClick={this.closeModal}>
                            <Icon name='remove' /> Cancel
                    </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        );
    }
}

export default ColorPanel;
