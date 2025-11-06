# Socket.IO Events Documentation

This document describes all the socket events used in the chat application.

## Client → Server (Emit)

### 1. Join Room

```javascript
socket.emit("join_room", {roomId: "room-123"});
```

**When:** When a user selects a conversation to join
**Expected Response:** `room_joined` event with room data

### 2. Leave Room

```javascript
socket.emit("leave_room", {roomId: "room-123"});
```

**When:** When switching to a different room or leaving the chat
**Expected Response:** `room_left` event

### 3. Get Room Messages

```javascript
socket.emit("get_room_messages", {
  roomId: "room-123",
  limit: 50,
  offset: 0,
});
```

**When:** After joining a room to fetch message history
**Expected Response:** `room_messages` event with message array

### 4. Send Message

```javascript
socket.emit("send_message", {
  roomId: "room-123", // or room_id
  content: "Hello!", // or message
  userId: "user-456", // or user_id
  timestamp: "2024-01-01T00:00:00.000Z",
});
```

**When:** When user sends a message
**Expected Response:** `message` or `message_sent` event

### 5. Typing Indicator

```javascript
socket.emit("typing", {
  roomId: "room-123",
  isTyping: true,
  userId: "user-456",
});
```

**When:** When user starts/stops typing
**Expected Response:** `typing` event broadcast to other users

## Server → Client (Listen)

### 1. Connection Events

```javascript
socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});
```

### 2. Room Events

```javascript
// Successful room join
socket.on("room_joined", (data) => {
  // data: { roomId: "room-123", success: true }
});

// Room left
socket.on("room_left", (data) => {
  // data: { roomId: "room-123" }
});

// Room messages received
socket.on("room_messages", (data) => {
  // data: { messages: [...] } or just [...]
});
```

### 3. Message Events

```javascript
// New message received
socket.on("message", (message) => {
  // message: { id, content, userId, timestamp, roomId }
});

// Message sent confirmation
socket.on("message_sent", (data) => {
  // data: { success: true, message: {...} }
});
```

### 4. Typing Events

```javascript
socket.on("typing", (data) => {
  // data: { userId, userName, isTyping, roomId }
});
```

### 5. User Status Events

```javascript
socket.on("user_online", (data) => {
  // data: { userId, userName }
});

socket.on("user_offline", (data) => {
  // data: { userId }
});
```

## Alternative Event Names

Different socket servers may use different event names. The app supports these alternatives:

### Room ID

- `roomId` or `room_id`

### User ID

- `userId` or `user_id`

### Message Content

- `content` or `message`

### Events

- `send_message` or `sendMessage`
- `join_room` or `joinRoom`
- `leave_room` or `leaveRoom`
- `get_room_messages` or `getRoomMessages` or `fetchMessages`

## Example Flow

1. **User Opens Chat**

   - Socket connects automatically
   - Rooms are fetched via REST API
   - User sees list of available rooms

2. **User Selects Room**

   ```
   Client: emit("join_room", { roomId: "123" })
   Server: emit("room_joined", { roomId: "123" })
   Client: emit("get_room_messages", { roomId: "123" })
   Server: emit("room_messages", { messages: [...] })
   ```

3. **User Sends Message**

   ```
   Client: emit("send_message", { roomId: "123", content: "Hi!" })
   Server: emit("message_sent", { success: true })
   Server: broadcast("message", { id, content, userId, timestamp })
   ```

4. **User Receives Message**

   ```
   Server: emit("message", { content: "Hello!", userId: "456" })
   Client: Adds message to UI
   ```

5. **User Switches Rooms**
   ```
   Client: emit("leave_room", { roomId: "123" })
   Client: emit("join_room", { roomId: "456" })
   Server: emit("room_joined", { roomId: "456" })
   Server: emit("room_messages", { messages: [...] })
   ```

## Testing Socket Events

To test the socket connection in the browser console:

```javascript
// Access the socket instance
const socket = window.__socket__;

// Test joining a room
socket.emit("join_room", {roomId: "test-room"});

// Test sending a message
socket.emit("send_message", {
  roomId: "test-room",
  content: "Test message",
  userId: "test-user",
});

// Listen for events
socket.on("message", (msg) => console.log("New message:", msg));
socket.on("room_messages", (msgs) => console.log("Room messages:", msgs));
```

## Troubleshooting

### Messages not appearing

- Check if `room_messages` event is received after joining
- Verify the message format matches expected structure
- Check browser console for socket events

### Cannot send messages

- Verify socket is connected
- Check if room is properly joined
- Verify message data format

### Connection issues

- Check socket URL is correct
- Verify CORS settings on server
- Check network tab for WebSocket connection
