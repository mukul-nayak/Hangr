import React, { useState, useRef, useEffect } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { getTimeAgo } from "../config/helper.js";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();
  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [loading, setLoading] = useState(false);

  //page init:
  //messages ko load karne honge
  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      try {
        const messages = await getMessages(roomId);
        // console.log(messages);
        setMessages(messages);
      } catch (error) {
        toast.error("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  //scroll Down
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  //stompClient ko init akrna hoga
  //subscribe
  useEffect(() => {
    let client = null;
    const connectWebSocket = () => {
      /// SockJS
      const sock = new SockJS(`${baseURL}/chat`);

      client = Stomp.over(sock);
      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected");
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          // console.log(message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
          //rest of the work after success recieving the message
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [roomId]);

  //send message handler

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      // console.log(input);

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      try {
        stompClient.send(
          `/app/sendMessage/${roomId}`,
          {},
          JSON.stringify(message),
        );
        setInput("");
      } catch (error) {
        toast.error("Failed to send message. Try again.");
      }
    }
  };

  //handle logout
  function handleLogout() {
    if (stompClient) {
      stompClient.disconnect();
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-950 dark:via-gray-900 dark:to-black text-white">
      {/* this is a header portion */}
      <header className="dark:border-gray-800 top-0 fixed w-full px-6 py-4 shadow-lg flex justify-around items-center dark:bg-gray-900/70 backdrop-blur-md z-50 border-b">
        {/* room name container */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Room
          </p>
          <h1 className="text-lg font-semibold max-w-[160px] md:max-w-none break-words">
            {roomId}
          </h1>
        </div>
        {/* username container */}
        <div>
          <p className="text-xs text-gray-400 uppercase">User</p>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{currentUser}</h1>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="">
          {/* leave room */}
          <button
            onClick={handleLogout}
            className="dark:bg-red-500 dark:hover:bg-red-700 px-5 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* chat content */}
      <main
        ref={chatBoxRef}
        className="pt-24 pb-28 px-4 md:px-8 w-full md:w-2/3 mx-auto h-screen overflow-y-auto scroll-smooth scrollbar-hide"
      >
        {loading ? (
          // shown while fetching messages
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          // shown when fetch done but no messages
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            No messages yet. Start the conversation 🚀
          </div>
        ) : (
          // shown when messages exist
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex animate-in fade-in duration-300  ${message.sender === currentUser ? "justify-end" : "justify-start"} `}
            >
              <div
                className={`my-2 ${message.sender === currentUser ? "bg-green-800 text-white ml-auto" : "bg-white/10 backdrop-blur-md border border-white/10"} p-4 rounded-2xl max-w-[85%] md:max-w-md shadow-lg hover:scale-[1.01] transition-all duration-200 hover:-translate-y-[1px]`}
              >
                <div className="flex flex-row gap-2">
                  {message.sender !== currentUser && (
                    <img
                      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${message.sender}`}
                      alt="avatar"
                      className="h-10 w-10 rounded-full dark:bg-white ring-2 ring-white/20"
                    />
                  )}
                  <div className=" flex flex-col gap-1">
                    <p className="text-sm font-bold">{message.sender}</p>
                    <p className="break-all whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getTimeAgo(message.timeStamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* input message container */}
      <div className=" fixed bottom-4 w-full h-16">
        <div className="h-full pr-3 gap-3 flex items-center justify-between rounded-full w-[95%] md:w-1/2 mx-auto dark:bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type your message here..."
            className="dark:bg-transparent dark:border-gray-600  w-full px-5 py-2 rounded-full h-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
          <div className="flex gap-1">
            <button className="bg-purple-500 hover:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
              <MdAttachFile size={20} />
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`h-10 w-10 flex justify-center items-center rounded-full transition-all duration-200 shadow-lg ${
                input.trim()
                  ? "bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95"
                  : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
