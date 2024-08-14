import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileModal from "./ProfileModal";
import { getFullSender, getSenderName } from "../../config/chatLogics";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollAbleChat from "../User Avatar/ScrollAbleChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    setNotifications,
    notifications,
  } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessage = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: "Bearer " + user.accessToken,
        },
      };

      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );
      console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Have an error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/messages/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Have an error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notifications
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  console.log(notifications);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "20px", md: "24px" }}
            pb={3}
            px={2}
            width="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            flexDirection="initial">
            <FontAwesomeIcon
              icon="fa-solid fa-arrow-left"
              style={{
                cursor: "pointer",
              }}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal user={getFullSender(user, selectedChat.users)}>
                  <FontAwesomeIcon
                    icon="fa-solid fa-eye"
                    style={{ cursor: "pointer" }}
                  />
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}{" "}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDirection="column"
            justifyConten="flex-end"
            p={3}
            bg="#E8E8E8"
            width="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="message">
                <ScrollAbleChat messages={messages} />
              </div>
            )}
          </Box>
          <FormControl onKeyDown={sendMessage} mt={3}>
            {isTyping ? (
              <Lottie
                options={defaultOptions}
                style={{
                  width: "30px",
                  marginBottom: 15,
                  marginLeft: 0,
                  height: "30px",
                  borderRadius: "70%",
                }}
              />
            ) : (
              <></>
            )}
            <Input
              placeholder="Enter a message"
              variant="filled"
              bg="#E0E0E0"
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%">
          <Text fontSize="3xl">Click on a user to start a chat</Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
