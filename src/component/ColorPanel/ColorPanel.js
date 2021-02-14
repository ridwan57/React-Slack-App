import React from "react";
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from "semantic-ui-react";
import { SliderPicker } from 'react-color'
import firebase from '../../firebase/firebase'
import { setColors } from '../../actions/index'
import { connect } from "react-redux";
class ColorPanel extends React.Component {
    state = {
        modal: false,
        primary: '',
        secondary: '',
        usersRef: firebase.database().ref('users'),
        user: this.props.currentUser,
        userColors: []
    }
    componentDidMount() {
        if (this.state.user) {
            this.addListner(this.state.user.uid)
        }
    }
    addListner = userId => {
        let userColors = [];
        this.state.usersRef
            .child(`${userId}/colors`)
            .on("child_added", snap => {
                userColors.unshift(snap.val())
                console.log(userColors)
                this.setState({ userColors })
            })
    }
    displayUserColors = colors =>
        colors.length > 0 &&
        colors.map((color, i) => (
            <React.Fragment key={i}>
                <Divider />
                <div
                    className="color__container"
                    onClick={() => this.props.setColors(color.primary, color.secondary)}
                >
                    <div className="color__square" style={{ background: color.primary }}>
                        <div
                            className="color__overlay"
                            style={{ background: color.secondary }}
                        />
                    </div>
                </div>
            </React.Fragment>
        ));

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
        const { modal, primary, secondary, userColors } = this.state;

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
                {this.displayUserColors(userColors)}
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

export default connect(null, { setColors })(ColorPanel);
