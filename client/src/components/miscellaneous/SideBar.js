import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatContext } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../User Avatar/UserListItem";
import { getSenderName } from "../../config/chatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
function SideBar() {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    setSelectedChat,
    chat,
    setChat,
    notifications,
    setNotifications,
  } = useContext(ChatContext);
  const btnRef = useRef();
  const history = useHistory();
  const toast = useToast();
  const handleLogOut = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please search a user",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      };

      const { data } = await axios.get(
        `api/users?search_name=${search}`,
        config
      );

      if (data.length === 0) {
        toast({
          title: "Cannot find User",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        setSearchResult(data);
        return;
      }
      toast({
        title: "Search successful.",
        description: "User found.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to search user.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (id) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      };

      const { data } = await axios.post("/api/chats", { userId: id }, config);
      if (!chat.find((c) => c._id === data._id)) {
        setChat([data, ...chat]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message || "Unable to search user.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px">
        <Tooltip label="Search User" hasArrow placement="bottom-end">
          <Button colorScheme="teal" variant="solid" onClick={onOpen}>
            <FontAwesomeIcon
              style={{ padding: "5px" }}
              icon="fa-solid fa-magnifying-glass"
            />
            Search User
          </Button>
        </Tooltip>

        <Text fontSize="2xl">Chat App </Text>
        <div>
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="teal"
              variant="solid"
              style={{ marginRight: "5px" }}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <FontAwesomeIcon icon="fa-solid fa-bell" />
            </MenuButton>
            <MenuList>
              {!notifications.length && "No new messages"}
              {notifications.map((notification) => {
                return (
                  <MenuItem
                    key={notification._id}
                    onClick={() => {
                      setSelectedChat(notification.chat);
                      setNotifications(
                        notifications.filter((n) => n !== notification)
                      );
                    }}>
                    {notification.chat.isGroupChat
                      ? `New message in ${notification.chat.chatName}`
                      : `New message from ${getSenderName(
                          user,
                          notification.chat.users
                        )}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} variant="solid" colorScheme="teal">
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>
                  <FontAwesomeIcon
                    icon="fa-solid fa-user"
                    style={{ paddingRight: "10px" }}
                  />
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuItem onClick={handleLogOut}>
                <FontAwesomeIcon
                  icon="fa-solid fa-right-from-bracket"
                  style={{ paddingRight: "10px" }}
                />
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                mr={2}
                placeholder="Type here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading></ChatLoading>
            ) : (
              searchResult?.map((result) => {
                return (
                  <UserListItem
                    key={result._id}
                    user={result}
                    handleFunction={() =>
                      accessChat(result._id)
                    }></UserListItem>
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBar;
