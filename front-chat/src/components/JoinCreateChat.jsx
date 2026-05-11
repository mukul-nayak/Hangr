import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";

const JoinCreateChat = () => {
  const [loadingAction, setLoadingAction] = useState(null);
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();

  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId.trim() === "" || detail.userName.trim() === "") {
      toast.error("Please fill all fields");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      //join chat
      setLoadingAction("join");

      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined room successfully");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
          // console.log(error);
        }
      } finally {
        setLoadingAction(null);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      //create room
      // console.log(detail);
      // call api to create room on backend
      setLoadingAction("create");
      try {
        const response = await createRoomApi(detail.roomId);
        // console.log(response);
        // toast.success("Room Created & ID Copied to clipboard!");
        toast.success("Room created successfully!");
        //copy it to clipboard
        try {
          await navigator.clipboard.writeText(response.roomId);
          toast.success("Room ID copied to clipboard!");
        } catch {
          toast("Room ID: " + response.roomId, { duration: 6000 });
        }

        //join the room
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);

        navigate("/chat");
        //forward to chat page...
      } catch (error) {
        // console.log(error);
        if (error.status === 400) {
          toast.error("Room already exists !!");
        } else {
          toast.error("Error in creating Room");
        }
      } finally {
        setLoadingAction(null);
      }
    }
  }

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-950 dark:to-gray-900 relative px-4">
      <div className="absolute w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] -top-20 -left-20 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-orange-500/30 rounded-full blur-[120px] -bottom-20 -right-20 animate-pulse" />
      <div className="w-full max-w-sm p-6 sm:p-8 dark:border-gray-700 border flex flex-col gap-5 rounded-2xl dark:bg-gray-900/90 backdrop-blur-md shadow-xl relative z-10">
        <div>
          <img src={chatIcon} alt="Chat Icon" className="w-24 mx-auto" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold leading-tight m-0">
            Start a Conversation
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0">
            Connect instantly with friends
          </p>
        </div>
        {/* name div */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Your Name
          </label>
          <input
            onChange={handleFormInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                joinChat();
              }
            }}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            placeholder="Enter your name"
            autoFocus
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
          />
        </div>
        {/* room id div */}
        <div className="">
          <label htmlFor="roomId" className="block font-medium mb-2">
            Room ID / New Room ID
          </label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                joinChat();
              }
            }}
            value={detail.roomId}
            type="text"
            id="roomId"
            placeholder="Enter or create a room ID"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1 px-2">
            {detail.roomId.length > 0
              ? `${detail.roomId.length} characters`
              : "Share this ID to let people join"}
          </p>
        </div>
        {/* button */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={joinChat}
            disabled={loadingAction !== null}
            className="px-5 py-2 dark:bg-blue-500 hover:dark:bg-blue-600 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAction === "join" ? "Joining..." : "Join Room"}
          </button>
          <button
            onClick={createRoom}
            disabled={loadingAction !== null}
            className="px-5 py-2 dark:bg-orange-500 hover:dark:bg-orange-600 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAction === "create" ? "Creating..." : "Create Room"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
