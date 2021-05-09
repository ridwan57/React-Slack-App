import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import { selectColors, selectUser } from "../selectors";
import "./App.css";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const { currentUser } = useSelector(selectUser);

  const {
    currentChannel,
    isPrivateChannel,
    userPosts,
  } = useSelector((state) => ({ ...state.channel }));

  const { primaryColor, secondaryColor } = useSelector(selectColors);

  return (
    <Grid
      columns="equal"
      className="app"
      style={{ background: secondaryColor }}
    >
      <ToastContainer />
      {/* <ColorPanel /> */}
      <SidePanel
        key={currentUser?.uid}
        currentUser={currentUser}
        primaryColor={primaryColor}
      />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          // currentChannel={currentChannel}
          // currentUser={currentUser}
          // isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>

      <Grid.Column width="4">
        <MetaPanel
        // key={currentChannel && currentChannel.name}
        // isPrivateChannel={isPrivateChannel}
        // currentChannel={currentChannel}
        // userPosts={userPosts}
        />
      </Grid.Column>
    </Grid>
  );
};
// const mapStateToProps = (state) => ({
//   currentUser: state.user.currentUser,
//   currentChannel: state.channel.currentChannel,
//   isPrivateChannel: state.channel.isPrivateChannel,
//   userPosts: state.channel.userPosts,
//   primaryColor: state.colors.primaryColor,
//   secondaryColor: state.colors.secondaryColor,
// });

export default App;
