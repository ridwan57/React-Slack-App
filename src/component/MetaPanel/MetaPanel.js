import React from "react";
import { useSelector } from "react-redux";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
} from "semantic-ui-react";
import { selectChannel } from "../../selectors";

const MetaPanel = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { currentChannel: channel, isPrivateChannel, userPosts } = useSelector(
    selectChannel
  );

  const handleActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
    // setState({ activeIndex: newIndex });
  };

  const formatCount = (num) =>
    num > 1 || num === 0 ? `${num} posts` : `${num} post`;

  const displayTopPosters = (posts) =>
    Object.entries(posts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  console.log("userPosts:", userPosts);

  if (isPrivateChannel) return null;

  return (
    <Segment loading={!channel}>
      <Header as="h3" attached="top">
        About # {channel && channel.name}
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          Channel Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {channel && channel.details}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          Top Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <List>{userPosts && displayTopPosters(userPosts)}</List>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={handleActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Header as="h3">
            <Image circular src={channel && channel.createdBy.avatar} />
            {channel && channel.createdBy.name}
          </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
};

export default MetaPanel;
