import React from "react";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";
import firebase from "../../firebase/firebase";
import { setColors } from "../../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { selectColors, selectUser } from "../../selectors";

const ColorPanel = () => {
  const [modal, setModal] = useState(false);
  const { primaryColor, secondaryColor } = useSelector(selectColors);
  const [primary, setPrimary] = useState(primaryColor);
  const [secondary, setSecondary] = useState(secondaryColor);
  const [userColors, setUserColors] = useState([]);

  const { currentUser: user } = useSelector(selectUser);

  const dispatch = useDispatch();

  const usersRef = firebase.database().ref("users");

  const addListener = React.useCallback(
    (userId) => {
      let localUserColors = [];
      usersRef.child(`${userId}/colors`).on("child_added", (snap) => {
        localUserColors.unshift(snap.val());

        setUserColors(localUserColors);

        // const { primary: newPrimary, secondary: newSecondary } = userColors;
        // setPrimary(newPrimary);
        // setSecondary(newSecondary);
      });
    },
    [usersRef]
  );

  React.useEffect(() => {
    // console.log("colorPanel_useEffect");
    if (user?.uid) {
      addListener(user.uid);
    }
    return () =>
      user?.id && usersRef.child().child(`${user?.uid}/colors`).off();
  }, [user, addListener, usersRef]);

  const displayUserColors = (colors) =>
    colors?.length > 0 &&
    colors?.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div
          className="color__container"
          onClick={() => dispatch(setColors(color.primary, color.secondary))}
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

  const handleChangePrimary = (color) => {
    setPrimary(color.hex);
    // setState({ primary: color.hex });
  };
  const handleSaveColors = () => {
    if (primary && secondary) {
      saveColors(primary, secondary);
    }
  };
  const saveColors = (primary, secondary) => {
    usersRef
      .child(`${user.uid}/colors`)
      .push()
      .update({
        primary,
        secondary,
      })
      .then(() => {
        console.log("Colors Added");
        closeModal();
      })
      .catch((err) => {
        if (err !== null) {
          console.log(err);
        }
      });
  };
  const handleChangeSecondary = (color) => {
    setSecondary(color.hex);
  };
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

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
      <Button icon="add" size="small" color="blue" onClick={openModal} />
      {displayUserColors(userColors)}
      {/* color picker modal */}

      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment inverted>
            <Label content="Primary color" />
            <SliderPicker onChange={handleChangePrimary} color={primary} />
          </Segment>
          <Segment inverted>
            <Label content="Secondary color" />
            <SliderPicker onChange={handleChangeSecondary} color={secondary} />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleSaveColors}>
            <Icon name="checkmark" /> Save Colors
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
};

export default ColorPanel;
