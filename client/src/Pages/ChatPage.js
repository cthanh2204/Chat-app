import React, { useEffect, useState, useContext } from "react";
import { ChatContext } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideBar from "../components/miscellaneous/SideBar";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
const ChatPage = () => {
  const { user, setUser } = useContext(ChatContext);
  const [fetchChat, setFetchChat] = useState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px">
        {user && (
          <MyChats fetchAgain={fetchChat} setFetchAgain={setFetchChat} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchChat} setFetchAgain={setFetchChat} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
