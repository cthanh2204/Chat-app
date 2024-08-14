import { Box, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Text
      padding="4px"
      borderRadius="lg"
      m={1}
      mb={2}
      backgroundColor="teal"
      color="white"
      cursor="pointer"
      variant="solid"
      fontSize={12}
      display="inline-block"
      onClick={handleFunction}>
      {user.name}
      <FontAwesomeIcon
        icon="fa-solid fa-delete-left"
        style={{ marginLeft: "5px" }}
      />
    </Text>
  );
};

export default UserBadgeItem;
