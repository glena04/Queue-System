
// Add this at the top, after your imports
type User = {
  id: number;
  email: string;
  role: 'admin' | 'staff' | 'customer';
};

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { loginAsync } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.auth.error);
  const user = useAppSelector((state) => state.auth.user) as User | null;
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }
    dispatch(loginAsync({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate('/counter');
      } else {
        navigate('/customer');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Login;