import { Skeleton, SkeletonText, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack>
      <SkeletonText mt="4" noOfLines={5} spacing="5" skeletonHeight="3" />
    </Stack>
  );
};

export default ChatLoading;
