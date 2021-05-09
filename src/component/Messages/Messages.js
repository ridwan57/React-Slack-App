/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import { connect, useDispatch, useSelector } from "react-redux";
import { setUserPosts } from "../../actions";
import firebase from "../../firebase/firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import Typing from "./Typing";
import Skeleton from "./Skeleton";
import { selectChannel, selectUser } from "../../selectors";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Messages = () => {
  const dispatch = useDispatch();
  const {
    isPrivateChannel: privateChannel,
    currentChannel: channel,
  } = useSelector(selectChannel);

  const { currentUser: user } = useSelector(selectUser);

  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [listeners, setListeners] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [isChannelStarred, setIsChannelStarred] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [numUniqueUsers, setNumUniqueUsers] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const privateMessagesRef = firebase.database().ref("privateMessages");

  const messagesRef = firebase.database().ref("messages");

  const usersRef = firebase.database().ref("users");

  const typingRef = firebase.database().ref("typing");

  const connectedRef = firebase.database().ref(".info/connected");
  const messagesEnd = React.createRef();

  //   state = {
  //     privateChannel: props.isPrivateChannel,
  //     privateMessagesRef: firebase.database().ref("privateMessages"),
  //     messagesRef: firebase.database().ref("messages"),
  //     messages: [],
  //     messagesLoading: true,
  //     channel: props.currentChannel,
  //     isChannelStarred: false,
  //     user: props.currentUser,
  //     usersRef: firebase.database().ref("users"),
  //     numUniqueUsers: "",
  //     searchTerm: "",
  //     searchLoading: false,
  //     searchResults: [],
  //     typingRef: firebase.database().ref("typing"),
  //     typingUsers: [],
  //     connectedRef: firebase.database().ref(".info/connected"),
  //     listeners: [],
  //   };

  const removeListeners = (listeners) => {
    listeners.forEach((listener) => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  const addListeners = (channelId) => {
    addMessageListener(channelId);
    addTypingListeners(channelId);
  };

  const addTypingListeners = (channelId) => {
    let typingUsers = [];
    typingRef.child(channelId).on("child_added", (snap) => {
      if (snap.key !== user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val(),
        });
        //   setState({ typingUsers });
        setTypingUsers(typingUsers);
      }
    });

    addToListeners(channelId, typingRef, "child_added");

    typingRef.child(channelId).on("child_removed", (snap) => {
      const index = typingUsers.findIndex((user) => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter((user) => user.id !== snap.key);
        //   setState({ typingUsers });
        setTypingUsers(typingUsers);
      }
    });
    addToListeners(channelId, typingRef, "child_removed");

    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        typingRef
          .child(channelId)
          .child(user.uid)
          .onDisconnect()
          .remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    });
  };

  const addMessageListener = (channelId) => {
    let loadedMessages = [];
    const ref = getMessagesRef();
    ref.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      //   setState({
      //     messages: loadedMessages,
      //     messagesLoading: false,
      //   });
      setMessages(loadedMessages);
      setMessagesLoading(false);
      countUniqueUsers(loadedMessages);
      countUserPosts(loadedMessages);
    });
    addToListeners(channelId, ref, "child_added");
  };

  const addUserStarsListener = (channelId, userId) => {
    usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          // setState({ isChannelStarred: prevStarred });
          setIsChannelStarred(prevStarred);
        }
      });
  };

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const starChannel = () => {
    console.log("starChannel:", starChannel);
    if (isChannelStarred) {
      usersRef.child(`${user.uid}/starred`).update({
        [channel.id]: {
          name: channel.name,
          details: channel.details,
          createdBy: {
            name: channel.createdBy.name,
            avatar: channel.createdBy.avatar,
          },
        },
      });
    } else {
      usersRef
        .child(`${user.uid}/starred`)
        .child(channel.id)
        .remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  const handleSearchMessages = () => {
    const channelMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    // setState({ searchResults });
    setTimeout(
      () =>
        //   setState({ searchLoading: false })
        setSearchLoading(false),
      1000
    );
  };

  useEffect(() => {
    if (channel && user) {
      removeListeners(listeners);
      addListeners(channel.id);
      addUserStarsListener(channel.id, user.uid);
    }
    return () => {
      removeListeners(listeners);
      connectedRef.off();
    };
  }, [
    channel,
    user,
    // listeners,
    // addListeners,
    // addUserStarsListener,
    // removeListeners,
  ]);

  useEffect(() => {
    if (messagesEnd.current) {
      scrollToBottom();
    }
  }, [messagesEnd]);

  useEffect(() => {
    // toast.success(`${user ? user : "No user"}`);
    if (user && channel) starChannel();
  }, [isChannelStarred, user, channel]);

  useEffect(() => {
    if (user && channel) {
      handleSearchMessages();
    }
  }, [searchTerm, user, channel]);

  // componentDidMount() {
  //     const { channel, user, listeners } = state;

  //     if (channel && user) {
  //         removeListeners(listeners);
  //         addListeners(channel.id);
  //         addUserStarsListener(channel.id, user.uid);
  //     }
  // }

  // componentWillUnmount() {
  //     removeListeners(listeners);
  //     connectedRef.off();
  // }

  // componentDidUpdate(prevProps, prevState) {
  //     if (messagesEnd) {
  //         scrollToBottom();
  //     }
  // }

  const addToListeners = (id, ref, event) => {
    const index = listeners.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      // setState({ listeners: listeners.concat(newListener) });
      setListeners((prev) => [...prev, newListener]);
    }
  };

  const getMessagesRef = () => {
    // const { messagesRef, privateMessagesRef, privateChannel } = state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  const handleStar = () => {
    setIsChannelStarred((prev) => !prev);
    // setState(
    //   (prevState) => ({
    //     isChannelStarred: !previsChannelStarred,
    //   }),
    //   () => starChannel()      //*************Important */
    // );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
    // setState(
    //   {
    //     searchTerm: event.target.value,
    //     searchLoading: true,
    //   },
    //   () => handleSearchMessages()  *** Important
    // );
  };

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    setNumUniqueUsers(numUniqueUsers);
    // setState({ numUniqueUsers });
  };

  const countUserPosts = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});
    dispatch(setUserPosts(userPosts));
  };

  const displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message key={message.timestamp} message={message} user={user} />
    ));

  const displayChannelName = (channel) => {
    return channel ? `${privateChannel ? "@" : "#"}${channel.name}` : "";
  };

  const displayTypingUsers = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "0.2em" }}
        key={user.id}
      >
        <span className="user__typing">{user.name} is typing</span> <Typing />
      </div>
    ));

  const displayMessageSkeleton = (loading) =>
    loading ? (
      <React.Fragment>
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </React.Fragment>
    ) : null;

  // prettier-ignore

  return (
    <React.Fragment>
      <MessagesHeader
        channelName={displayChannelName(channel)}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
        isPrivateChannel={privateChannel}
        handleStar={handleStar}
        isChannelStarred={isChannelStarred}
      />

      <Segment>
        <Comment.Group className="messages">
          {displayMessageSkeleton(messagesLoading)}
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
          {displayTypingUsers(typingUsers)}
          <div ref={messagesEnd} />
        </Comment.Group>
      </Segment>

      <MessageForm
        messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={user}
        isPrivateChannel={privateChannel}
        getMessagesRef={getMessagesRef}
          />
          {/* {user && channel && } */}
    </React.Fragment>
  );
};

export default Messages;
