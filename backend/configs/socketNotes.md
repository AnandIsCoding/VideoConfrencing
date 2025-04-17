**🖥️ SERVER SIDE**
▶ socket.on (Client → Server)
The server receives a message from the client.

▶ socket.emit (Server → Client)
The server sends a message to that connected client.

| Action                 | Who Sends | Who Receives     | Method Used                                                  |
|------------------------|-----------|------------------|---------------------------------------------------------------|
| Client → Server        | Client    | Server           | `socket.emit()` on client  <br> `socket.on()` on server       |
| Server → Client        | Server    | Specific Client  | `socket.emit()` on server <br> `socket.on()` on client        |
| Server → All Clients   | Server    | Everyone         | `io.emit()` on server     <br> `socket.on()` on client        |
| Broadcast (not sender) | Server    | Other Clients    | `socket.broadcast.emit()` on server                           |



🧠 First, what is io.on('connection')?
It runs every time a new user connects to the server.

Think of it like: 🧑‍💻 "A new person joined — let’s handle them!"