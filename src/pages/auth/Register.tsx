import React, { useState } from 'react';
import axios from 'axios';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || !fullName) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Always register as customer from this page
      await axios.post('/api/auth/register', { 
        email, 
        password, 
        role: 'customer',
        fullName 
      });
      setSuccess('Registration successful! You can now log in.');
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h1>Customer Registration</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
};

export default Register;