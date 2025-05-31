import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  addCounter,
  deleteCounter,
  fetchCounters,
  Counter
} from '../../store/slices/countersSlice';
import {
  addService,
  deleteService,
  fetchServices,
} from '../../store/slices/servicesSlice';
import { fetchTickets, Ticket } from '../../store/slices/ticketsSlice';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const counters = useAppSelector((state) => state.counters.counters);
  const services = useAppSelector((state) => state.services.services);
  const tickets = useAppSelector((state) => state.tickets.tickets);

  // State for forms
  const [counterName, setCounterName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminRegisterError, setAdminRegisterError] = useState<string | null>(null);
  const [adminRegisterSuccess, setAdminRegisterSuccess] = useState<string | null>(null);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffFullName, setStaffFullName] = useState('');
  const [staffRegisterError, setStaffRegisterError] = useState<string | null>(null);
  const [staffRegisterSuccess, setStaffRegisterSuccess] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCounters());
    dispatch(fetchServices());
    dispatch(fetchTickets());
  }, [dispatch]);

  const calculateStats = () => {
    const servedToday = tickets.filter(
      (ticket) =>
        ticket.status === 'served' &&
        new Date(ticket.updatedAt).toDateString() === new Date().toDateString()
    ).length;

    const waitTimes = tickets
      .filter((ticket) => ticket.status === 'served' && ticket.scannedAt && ticket.servedAt)
      .map((ticket) => {
        const scannedTime = ticket.scannedAt ? new Date(ticket.scannedAt).getTime() : 0;
        const servedTime = ticket.servedAt ? new Date(ticket.servedAt).getTime() : 0;
        return (servedTime - scannedTime) / (1000 * 60);
      });

    const avgWaitTime =
      waitTimes.length > 0
        ? waitTimes.reduce((acc, time) => acc + time, 0) / waitTimes.length
        : 0;

    return {
      servedToday,
      avgWaitTime: avgWaitTime.toFixed(1),
    };
  };

  const stats = calculateStats();

  const handleAddCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (counterName.trim()) {
      dispatch(addCounter({ name: counterName }));
      setCounterName('');
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceName.trim()) {
      dispatch(
        addService({
          name: serviceName,
          description: serviceDescription,
        })
      );
      setServiceName('');
      setServiceDescription('');
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminRegisterError(null);
    setAdminRegisterSuccess(null);

    if (!adminEmail || !adminPassword || !adminFullName) {
      setAdminRegisterError('Please fill in all fields.');
      return;
    }

    try {
      await axios.post('/api/auth/register', {
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        fullName: adminFullName,
      });
      setAdminRegisterSuccess('Admin registered successfully!');
      setAdminEmail('');
      setAdminPassword('');
      setAdminFullName('');
    } catch (err: any) {
      setAdminRegisterError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleStaffRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffRegisterError(null);
    setStaffRegisterSuccess(null);

    if (!staffEmail || !staffPassword || !staffFullName) {
      setStaffRegisterError('Please fill in all fields.');
      return;
    }

    try {
      await axios.post('/api/auth/register', {
        email: staffEmail,
        password: staffPassword,
        role: 'staff',
        fullName: staffFullName,
      });
      setStaffRegisterSuccess('Counter staff registered successfully!');
      setStaffEmail('');
      setStaffPassword('');
      setStaffFullName('');
    } catch (err: any) {
      setStaffRegisterError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section className="stats-section">
        <h2>Statistics</h2>
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Served Today</h3>
            <p className="stat-value">{stats.servedToday}</p>
          </div>
          <div className="stat-card">
            <h3>Avg. Wait Time</h3>
            <p className="stat-value">{stats.avgWaitTime} min</p>
          </div>
        </div>
      </section>

      <section className="user-management-section">
        <h2>User Management</h2>
        <div className="registration-forms">
          <div className="admin-registration card">
            <h3>Register New Admin</h3>
            <form onSubmit={handleAdminRegister}>
              <input
                type="text"
                value={adminFullName}
                onChange={(e) => setAdminFullName(e.target.value)}
                placeholder="Full name"
                required
              />
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit">Register Admin</button>
            </form>
            {adminRegisterError && <div className="error">{adminRegisterError}</div>}
            {adminRegisterSuccess && <div className="success">{adminRegisterSuccess}</div>}
          </div>
          <div className="staff-registration card">
            <h3>Register Counter Staff</h3>
            <form onSubmit={handleStaffRegister}>
              <input
                type="text"
                value={staffFullName}
                onChange={(e) => setStaffFullName(e.target.value)}
                placeholder="Full name"
                required
              />
              <input
                type="email"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit">Register Staff</button>
            </form>
            {staffRegisterError && <div className="error">{staffRegisterError}</div>}
            {staffRegisterSuccess && <div className="success">{staffRegisterSuccess}</div>}
          </div>
        </div>
      </section>

      <section className="counters-section card">
        <h2>Counters Management</h2>
        <form onSubmit={handleAddCounter} className="inline-form">
          <input
            type="text"
            value={counterName}
            onChange={(e) => setCounterName(e.target.value)}
            placeholder="Counter Name"
            required
          />
          <button type="submit">Add Counter</button>
        </form>
        <div className="counters-list">
          <h3>Current Counters</h3>
          {counters.length === 0 ? (
            <p>No counters available</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Current Ticket</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {counters.map((counter: Counter) => (
                  <tr key={counter.id}>
                    <td>{counter.id}</td>
                    <td>{counter.name}</td>
                    <td>{counter.currentTicket || 'None'}</td>
                    <td>
                      <button
                        className="danger"
                        onClick={() => dispatch(deleteCounter(counter.id))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="services-section card">
        <h2>Services Management</h2>
        <form onSubmit={handleAddService} className="inline-form">
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Service Name"
            required
          />
          <input
            type="text"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            placeholder="Service Description"
          />
          <button type="submit">Add Service</button>
        </form>
        <div className="services-list">
          <h3>Current Services</h3>
          {services.length === 0 ? (
            <p>No services available</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{service.name}</td>
                    <td>{service.description}</td>
                    <td>
                      <button
                        className="danger"
                        onClick={() => dispatch(deleteService(service.id))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;