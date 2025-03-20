import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { server } from "../../server";

const ENDPOINT = "https://socket-ecommerce-tu68.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller, isLoading } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setMessages((prev) => [...prev, { sender: data.senderId, text: data.text, createdAt: Date.now() }]);
    });
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await axios.get(`${server}/conversation/get-all-conversation-seller/${seller?._id}`, { withCredentials: true });
        setConversations(response.data.conversations);
      } catch (error) {
        console.error(error);
      }
    };
    if (seller) getConversations();
  }, [seller, messages]);

  useEffect(() => {
    if (seller) {
      socketId.emit("addUser", seller._id);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = { sender: seller._id, text: newMessage, conversationId: currentChat._id };
    const receiverId = currentChat.members.find((member) => member !== seller._id);

    socketId.emit("sendMessage", { senderId: seller._id, receiverId, text: newMessage });

    try {
      const res = await axios.post(`${server}/message/create-new-message`, message);
      setMessages([...messages, res.data.message]);
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded shadow-md p-4">
      {!open ? (
        <>
          <h1 className="text-center text-2xl font-semibold py-3">All Messages</h1>
          {conversations.map((item, index) => (
            <MessageList key={index} data={item} setOpen={setOpen} setCurrentChat={setCurrentChat} sellerId={seller._id} isLoading={isLoading} />
          ))}
        </>
      ) : (
        <SellerInbox setOpen={setOpen} newMessage={newMessage} setNewMessage={setNewMessage} sendMessageHandler={sendMessageHandler} messages={messages} sellerId={seller._id} scrollRef={scrollRef} />
      )}
    </div>
  );
};

const MessageList = ({ data, setOpen, setCurrentChat, sellerId, isLoading }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const userId = data.members.find((user) => user !== sellerId);
    axios.get(`${server}/user/user-info/${userId}`).then((res) => setUser(res.data.user)).catch(console.error);
  }, [sellerId, data]);

  return (
    <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => { setCurrentChat(data); setOpen(true); navigate(`/dashboard-messages?${data._id}`); }}>
      <img src={user?.avatar?.url} alt="" className="w-12 h-12 rounded-full border" />
      <div className="pl-3">
        <h1 className="text-lg font-medium">{user?.name}</h1>
        <p className="text-sm text-gray-600">{!isLoading && (data.lastMessageId !== user?._id ? "You: " : `${user?.name.split(" ")[0]}: `)} {data.lastMessage}</p>
      </div>
    </div>
  );
};

const SellerInbox = ({ setOpen, newMessage, setNewMessage, sendMessageHandler, messages, sellerId, scrollRef }) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex p-3 items-center justify-between bg-gray-200">
        <h1 className="text-lg font-medium">Chat</h1>
        <AiOutlineArrowRight size={20} className="cursor-pointer" onClick={() => setOpen(false)} />
      </div>
      <div className="px-3 h-[65vh] overflow-y-scroll">
        {messages.map((item, index) => (
          <div key={index} className={`flex my-2 ${item.sender === sellerId ? "justify-end" : "justify-start"}`} ref={scrollRef}>
            <div className="bg-gray-200 p-2 rounded-lg text-sm">{item.text}</div>
            <p className="text-xs text-gray-500 pt-1">{format(item.createdAt)}</p>
          </div>
        ))}
      </div>
      <form className="p-3 flex items-center" onSubmit={sendMessageHandler}>
        <input type="text" placeholder="Enter your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full p-2 border rounded-lg focus:outline-none" />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"><AiOutlineSend size={20} /></button>
      </form>
    </div>
  );
};

export default DashboardMessages;
