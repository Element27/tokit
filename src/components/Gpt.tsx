import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Initialize Socket.io client
const socket = io('http://localhost:3000');

// Define interfaces for talk and attendee
interface Talk {
  id: number;
  title: string;
}

interface Attendee {
  id: number;
  name: string;
}

const Gpt: React.FC = () => {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [newTalk, setNewTalk] = useState('');
  const [newAttendee, setNewAttendee] = useState('');

  useEffect(() => {
    // Fetch all talks
    fetchTalks();

    // Listen for new talks from the server
    socket.on('newTalk', (talk: Talk) => {
      setTalks((prevTalks) => [...prevTalks, talk]);
    });

    // Clean up socket.io on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchTalks = async () => {
    try {
      const response = await fetch('/api/talks');
      const data = await response.json();
      setTalks(data);
    } catch (error) {
      console.error('Error fetching talks:', error);
    }
  };

  const addTalk = async () => {
    try {
      const response = await fetch('/api/talks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTalk }),
      });
      const talk = await response.json();
      setTalks((prevTalks) => [...prevTalks, talk]);
      setNewTalk('');
    } catch (error) {
      console.error('Error adding talk:', error);
    }
  };

  const updateTalk = async (talk: Talk) => {
    try {
      await fetch(`/api/talks/${talk.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: talk.title }),
      });
    } catch (error) {
      console.error('Error updating talk:', error);
    }
  };

  const deleteTalk = async (talk: Talk) => {
    try {
      await fetch(`/api/talks/${talk.id}`, {
        method: 'DELETE',
      });
      setTalks((prevTalks) => prevTalks.filter((t) => t.id !== talk.id));
    } catch (error) {
      console.error('Error deleting talk:', error);
    }
  };

  const addAttendee = async () => {
    try {
      const response = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAttendee }),
      });
      const attendee = await response.json();
      setAttendees((prevAttendees) => [...prevAttendees, attendee]);
      setNewAttendee('');
    } catch (error) {
      console.error('Error adding attendee:', error);
    }
  };

  const addAttendeeToTalk = async (attendee: Attendee, talk: Talk) => {
    try {
      await fetch(`/api/talks/${talk.id}/attendees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendeeId: attendee.id }),
      });
    } catch (error) {
      console.error('Error adding attendee to talk:', error);
    }
  };

  const handleTalkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTalk(e.target.value);
  };

  const handleAttendeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAttendee(e.target.value);
  };

  return (
    <div>
      <h1>Talks</h1>
      <ul>
        {talks.map((talk) => (
          <li key={talk.id}>
            <input
              type="text"
              value={talk.title}
              onChange={(e) =>
                updateTalk({ ...talk, title: e.target.value })
              }
            />
            <button onClick={() => deleteTalk(talk)}>Delete</button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newTalk}
        onChange={handleTalkChange}
        placeholder="New talk title"
      />
      <button onClick={addTalk}>Add Talk</button>

      <h2>Attendees</h2>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id}>{attendee.name}</li>
        ))}
      </ul>

      <input
        type="text"
        value={newAttendee}
        onChange={handleAttendeeChange}
        placeholder="New attendee name"
      />
      <button onClick={addAttendee}>Add Attendee</button>

      <h2>Chat</h2>
      {/* Render chat component */}
      <ChatComponent attendees={attendees} socket={socket} />
    </div>
  );
};

interface ChatComponentProps {
  attendees: Attendee[];
  socket: SocketIOClient.Socket;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  attendees,
  socket,
}) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listen for new chat messages from the server
    socket.on('chatMessage', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [socket]);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      socket.emit('chatMessage', newMessage);
      setNewMessage('');
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={handleMessageChange}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Gpt;
