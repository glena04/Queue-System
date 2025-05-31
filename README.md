### Architecture Overview

1. **Frontend**: Built with React.js, using libraries like React Router for navigation, Redux for state management, and Axios for API calls.
2. **Backend**: A RESTful API (Node.js with Express, for example) to handle ticket generation, queue management, and user authentication.
3. **Database**: A database (like MongoDB or PostgreSQL) to store user data, tickets, and queue information.
4. **Real-time Updates**: Use WebSockets (Socket.io) for real-time updates to the queue status.

### Key Features

1. **User Authentication**: Users can log in and register.
2. **Ticket Generation**: Users can generate tickets for services.
3. **Queue Management**: Admins can manage the queue, including viewing current tickets and their statuses.
4. **Real-time Updates**: Users receive real-time updates on their ticket status.
5. **Admin Dashboard**: Admins can view analytics, manage users, and handle tickets.

### Implementation Steps

#### 1. Set Up the Project

- Create a new React app using Create React App.
- Install necessary packages:
  ```bash
  npx create-react-app queue-management-system
  cd queue-management-system
  npm install react-router-dom redux react-redux axios socket.io-client
  ```

#### 2. Create the Folder Structure

```
src/
|-- components/
|   |-- auth/
|   |   |-- Login.tsx
|   |   |-- Register.tsx
|   |-- queue/
|   |   |-- TicketGenerator.tsx
|   |   |-- QueueStatus.tsx
|   |-- admin/
|   |   |-- AdminDashboard.tsx
|   |   |-- ManageTickets.tsx
|-- hooks/
|   |-- reduxHooks.ts
|-- redux/
|   |-- store.ts
|   |-- authSlice.ts
|   |-- queueSlice.ts
|-- App.tsx
|-- index.tsx
```

#### 3. Implement Authentication

**authSlice.ts**
```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { id: string; role: string };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ id: string; role: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
```

**Login.tsx**
```tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const response = await axios.post('/api/login', { email, password });
    dispatch(login(response.data.user));
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
```

#### 4. Ticket Generation

**TicketGenerator.tsx**
```tsx
import React, { useState } from 'react';
import axios from 'axios';

const TicketGenerator: React.FC = () => {
  const [service, setService] = useState('');

  const generateTicket = async () => {
    await axios.post('/api/tickets', { service });
    alert('Ticket generated!');
  };

  return (
    <div>
      <h2>Generate Ticket</h2>
      <input type="text" onChange={(e) => setService(e.target.value)} placeholder="Service" />
      <button onClick={generateTicket}>Generate</button>
    </div>
  );
};

export default TicketGenerator;
```

#### 5. Queue Management

**QueueStatus.tsx**
```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QueueStatus: React.FC = () => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const response = await axios.get('/api/tickets');
    setTickets(response.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Current Queue Status</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>{ticket.service} - {ticket.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default QueueStatus;
```

#### 6. Admin Dashboard

**AdminDashboard.tsx**
```tsx
import React from 'react';
import ManageTickets from './ManageTickets';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ManageTickets />
    </div>
  );
};

export default AdminDashboard;
```

**ManageTickets.tsx**
```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageTickets: React.FC = () => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const response = await axios.get('/api/admin/tickets');
    setTickets(response.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Manage Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>{ticket.service} - {ticket.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTickets;
```

#### 7. Real-time Updates

To implement real-time updates, you can use Socket.io. Set up a Socket.io server in your backend and connect to it in your React app.

**Socket Connection Example**
```tsx
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust the URL as needed

const useSocket = () => {
  useEffect(() => {
    socket.on('ticketUpdated', (data) => {
      // Handle the ticket update
    });

    return () => {
      socket.off('ticketUpdated');
    };
  }, []);
};

export default useSocket;
```

### Conclusion

This is a basic outline of how to create a Modern Queue Management System using React.js. You will need to implement the backend API, handle user roles, and add more features as needed. Additionally, consider adding error handling, loading states, and styling for a better user experience.