import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = (props) => {
  const {
    isChannelStarred,
    isPrivateChannel,
    channelName,
    numUniqueUsers,
    handleSearchChange,
    searchLoading,
    handleStar,
  } = props;
  return (
    <Segment clearing>
      {/* Channel Title */}
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          {!isPrivateChannel && (
            <Icon
              name={isChannelStarred ? "star" : "star outline"}
              color="black"
              onClick={handleStar}
            />
          )}
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>

      {/* Channel Search Input */}
      <Header floated="right">
        <Input
          loading={searchLoading}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
          onChange={handleSearchChange}
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
