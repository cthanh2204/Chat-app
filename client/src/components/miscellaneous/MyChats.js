import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/chatLogics";
import GroupChatModal from "./GroupChatModal";
function MyChats({ fetchAgain, setFetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chat, setChat } =
    useContext(ChatContext);

  const toast = useToast();

  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + user.accessToken,
        },
      };

      const { data } = await axios.get("/api/chats", config);
      setChat(data);
    } catch (error) {
      toast({
        title: "Error Occur",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        possition: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      padding={3}
      background="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "28px" }}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center">
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}>
            <FontAwesomeIcon
              icon="fa-solid fa-plus"
              style={{ marginRight: "3px" }}
            />
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden">
        {chat ? (
          <Stack overflowY="scroll">
            {chat?.map((c) => {
              return (
                <Box
                  onClick={() => setSelectedChat(c)}
                  bg={selectedChat === c ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === c ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={c._id}
                  cursor="pointer"
                  _hover={{
                    background: "#38B2AC",
                    color: "white",
                  }}>
                  <Text>
                    {!c.isGroupChat ? (
                      getSender(loggedUser, c.users)
                    ) : (
                      <Box>
                        <Avatar
                          mr={2}
                          size="sm"
                          name={c.chatName}
                          src={c.pic}
                        />
                        <Text>{c.chatName}</Text>
                      </Box>
                    )}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
