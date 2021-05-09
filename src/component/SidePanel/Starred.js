import React, { useCallback, useState } from "react";
import firebase from "../../firebase/firebase";
import { connect, useDispatch, useSelector } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import { Menu, Icon } from "semantic-ui-react";
import { selectChannel, selectUser } from "../../selectors";

const Starred = () => {
  const { currentUser: user } = useSelector(selectUser);
  const { currentChannel: channel } = useSelector(selectChannel);
  const dispatch = useDispatch();
  const usersRef = firebase.database().ref("users");
  const [activeChannel, setActiveChannel] = useState("");
  const [starredChannels, setStarredChannels] = useState([]);

  // state = {
  //   user: props.currentUser,
  //   activeChannel: "",
  //   starredChannels: []
  // };
  const addListeners = useCallback((userId) => {
    usersRef
      .child(userId)
      .child("starred")
      .on("child_added", (snap) => {
        const starredChannel = { id: snap.key, ...snap.val() };

        setStarredChannels((prev) => [...prev, starredChannel]);
      });

    usersRef
      .child(userId)
      .child("starred")
      .on("child_removed", (snap) => {
        const channelToRemove = { id: snap.key, ...snap.val() };
        const filteredChannels = starredChannels.filter((channel) => {
          return channel.id !== channelToRemove.id;
        });
        // setState({ starredChannels: filteredChannels });
        setStarredChannels(filteredChannels);
      });
  }, []);

  // const addListeners = (userId) => {
  //   usersRef
  //     .child(userId)
  //     .child("starred")
  //     .on("child_added", (snap) => {
  //       const starredChannel = { id: snap.key, ...snap.val() };

  //       setStarredChannels((prev) => [...prev, starredChannel]);
  //     });

  //   usersRef
  //     .child(userId)
  //     .child("starred")
  //     .on("child_removed", (snap) => {
  //       const channelToRemove = { id: snap.key, ...snap.val() };
  //       const filteredChannels = starredChannels.filter((channel) => {
  //         return channel.id !== channelToRemove.id;
  //       });
  //       // setState({ starredChannels: filteredChannels });
  //       setStarredChannels(filteredChannels);
  //     });
  // };

  React.useEffect(() => {
    if (user) {
      addListeners(user.uid);
    }
    return () => usersRef.child(`${user.uid}/starred`).off();
  }, [user, addListeners, channel]);

  // componentDidMount() {
  //   if (user) {
  //     addListeners(user.uid);
  //   }
  // }
  // componentWillUnmount() {
  //   removeListenr()
  // }
  // removeListenr = () => {
  //   usersRef.child(`${user.uid}/starred`).off()

  // }

  const changeChannel = (channel) => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
  };

  const displayChannels = (starredChannels) =>
    starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
        </span>{" "}
        ({starredChannels.length})
      </Menu.Item>
      {displayChannels(starredChannels)}
    </Menu.Menu>
  );
};

export default Starred;
