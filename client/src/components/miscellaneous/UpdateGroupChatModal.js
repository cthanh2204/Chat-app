import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import UserBadgeItem from "../User Avatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../User Avatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  // const [selectedUser, setSelectedUser] = useState([]);
  const toast = useToast();
  const handleDelete = async (delUser) => {
    if (selectedChat.groupAdmin._id !== user._id && delUser._id !== user._id) {
      toast({
        title: "Only admin can add users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + user.accessToken,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/chats/group-remove",
        {
          chatId: selectedChat._id,
          userId: delUser._id,
        },
        config
      );

      delUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessage();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occur",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setRenameLoading(false);
    }
  };
  const handleRename = async () => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can change group name",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: "Bearer " + user.accessToken,
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.put(
        "/api/chats/rename-group",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occur",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: "Bearer " + user.accessToken,
        },
        params: {
          search_name: search,
        },
      };

      const { data } = await axios.get(`/api/users`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setSearchResult();
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to search user.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (addUser) => {
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      toast({
        title: "User already added",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add users",
        status: "error",
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
          Authorization: "Bearer " + user.accessToken,
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/chats/group-add",
        {
          chatId: selectedChat._id,
          userId: addUser._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "An error occurred ",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <FontAwesomeIcon
        onClick={onOpen}
        icon="fa-solid fa-list"
        style={{ cursor: "pointer" }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName.toUpperCase()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              {selectedChat.users?.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                );
              })}
            </Box>

            <FormControl isRequired>
              <FormLabel>Update Group Chat Name</FormLabel>
              <Input
                mb={3}
                placeholder="Enter to change group name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}>
                Update
              </Button>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Add User</FormLabel>
              <Input
                placeholder="Add some users"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg"></Spinner>
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="red" mr={3} onClick={() => handleDelete(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
