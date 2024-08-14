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
import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../User Avatar/UserListItem";
import UserBadgeItem from "../User Avatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chat, setChat } = useContext(ChatContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
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
  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "An error occurred.",
        description: "User already exists",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "An error occurred.",
        description: "Enter all the field",
        status: "warning",
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

      const { data } = await axios.post(
        "/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setChat([data, ...chat]);
      onClose();
      toast({
        title: "New Group Chat Created",
        description: "Created success",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } catch (error) {
      toast({
        title: "An Error Occured",
        description: error.message || "Created failed",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Chat Name</FormLabel>
              <Input
                placeholder="Enter your chat name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Add User</FormLabel>
              <Input
                placeholder="Add some users"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {selectedUsers?.map((user) => {
              return (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              );
            })}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column">
              {loading ? (
                <Spinner
                  size="lg"
                  alignSelf="center"
                  margin="auto"
                  w={5}
                  h={5}></Spinner>
              ) : (
                searchResult?.map((user) => {
                  return (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  );
                })
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
