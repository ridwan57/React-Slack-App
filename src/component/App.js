import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import "./App.css";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";

const App = () => {
  const { currentUser } = useSelector((state) => ({ ...state.user }));

  const {
    currentChannel,
    isPrivateChannel,
    userPosts,
  } = useSelector((state) => ({ ...state.channel }));

  const { primaryColor, secondaryColor } = useSelector((state) => ({
    ...state.colors,
  }));

  return (
    <Grid
      columns="equal"
      className="app"
      style={{ background: secondaryColor }}
    >
      <ColorPanel
        key={currentUser && currentUser.name}
        currentUser={currentUser}
        // primaryColor={primaryColor}
        // secondaryColor={secondaryColor}
      />
      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
        primaryColor={primaryColor}
      />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>

      <Grid.Column width="4">
        <MetaPanel
          key={currentChannel && currentChannel.name}
          isPrivateChannel={isPrivateChannel}
          currentChannel={currentChannel}
          userPosts={userPosts}
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
