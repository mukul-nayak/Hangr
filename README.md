# 💬 Hangr - Connect instantly in shared virtual spaces

> A real-time group chat application built with Spring Boot, WebSocket (STOMP), and MongoDB.

---

## About

Hangr is a full-stack group chat application that allows users to create and join chat rooms, send and receive messages in real time, and access full chat history on room join - all persisted in MongoDB.

---

## Features

- Create a new chat room with a unique room ID
- Join an existing room and view all previous messages
- Real-time messaging via WebSocket (STOMP protocol)
- Message persistence using MongoDB
- Support for multiple rooms and users simultaneously

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot, Spring WebSocket, Spring Data MongoDB |
| Database | MongoDB |
| Frontend | React.js / Vanilla JavaScript |
| Real-Time | WebSocket (STOMP protocol) |

---

## Database Schema

**Room Collection (MongoDB)**

```json
{
  "_id": "6af7a0c7e6b3f5e8e4c9",
  "roomId": "study-room-123",
  "messages": [
    {
      "sender": "John",
      "content": "Welcome to the room!",
      "timestamp": "2024-11-27T10:15:30Z"
    },
    {
      "sender": "Alice",
      "content": "Hello, everyone!",
      "timestamp": "2024-11-27T10:16:00Z"
    }
  ]
}
```

---

## API Reference

### Room Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/room/create` | Create a new room |
| `GET` | `/room/{roomId}` | Fetch room and validate existence |

**Create Room — Request Body**
```json
{
  "roomId": "study-room-123"
}
```

### Messaging

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/room/{roomId}/message` | Send a message to a room |
| `GET` | `/room/{roomId}/messages` | Fetch all messages for a room |

**Send Message — Request Body**
```json
{
  "sender": "John",
  "content": "Hello!"
}
```

### WebSocket

| Endpoint | Description |
|---|---|
| `/chat` | WebSocket connection for real-time messaging |

---

## Frontend Pages

- **Homepage** - Options to create or join a room
- **Create Room** - Input field to enter a new room ID and submit
- **Join Room** - Input field to enter an existing room ID and join
- **Chat Room** - Scrollable message view with an input field to send messages
