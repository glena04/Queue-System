// filepath: src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Ensure 'root' matches the id in public/index.html
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);