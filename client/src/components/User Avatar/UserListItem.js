import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatProvider";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ handleFunction, user }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      width="100%"
      px={3}
      py={3}
      mb={2}
      borderRadius="lg">
      <Avatar mr={2} size="sm" name={user.name} src={user.pic}></Avatar>
      <Box>
        <Text>
          <b>{user.name}</b>
        </Text>
        <Text fontSize="s">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
