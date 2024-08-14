import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [chat, setChat] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      history.push("/");
    } else {
      setUser(userInfo);
      setLoading(false);
    }
  }, [history]);

  if (loading) {
    return <div>Loading...</div>; // Trạng thái chờ khi chưa có dữ liệu
  }

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chat,
        setChat,
        notifications,
        setNotifications,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
