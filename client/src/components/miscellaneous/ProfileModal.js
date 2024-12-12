import {
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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

function ProfileModal({ user, userDetail, setUserDetail, children }) {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState("");
  const [userPic, setUserPic] = useState("");
  const toast = useToast();

  const uploadImage = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUserPic(reader.result);
    };
  };
  const editUserProfile = async (name, pic) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.put(
        "/api/users/edit",
        { name, pic },
        config
      );
      setUserDetail(data);
      setUserName("");
      setUserPic("");
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message || "Cannot find User",
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
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ width: "500px", height: "600px" }}>
          {loading ? (
            <ModalBody
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column">
              Loading...
            </ModalBody>
          ) : (
            <>
              <ModalHeader>{userDetail?.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column">
                <img
                  src={userDetail?.pic}
                  style={{
                    borderRadius: "50%",
                    width: "200px",
                    height: "200px",
                  }}
                  alt="#"
                />
                <Text fontSize="2xl">Email: {userDetail?.email}</Text>

                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Enter your name"
                    value={userName}
                    type="text"
                    onChange={(e) => setUserName(e.target.value)}></Input>
                </FormControl>

                <FormControl id="pic">
                  <FormLabel></FormLabel>
                  <Input
                    type="file"
                    p={1.5}
                    accept="image/"
                    onChange={(e) => uploadImage(e.target.files[0])}></Input>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => editUserProfile(userName, userPic)}>
                  Edit
                </Button>
                <Button colorScheme="red" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
