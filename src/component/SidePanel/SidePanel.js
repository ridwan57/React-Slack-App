import React, { Component } from "react";
import { useSelector } from "react-redux";
import { Menu } from "semantic-ui-react";
import { selectColors, selectUser } from "../../selectors";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";
import UserPanel from "./UserPanel";
const SidePanel = () => {
  const { currentUser } = useSelector(selectUser);
  const { primaryColor } = useSelector(selectColors);
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: primaryColor, fontsize: "1.2rem" }}
    >
      <UserPanel primaryColor={primaryColor} currentUser={currentUser} />
      <Starred />

      <Channels currentUser={currentUser} />
      <DirectMessages currentUser={currentUser} />
    </Menu>
  );
};
export default SidePanel;
