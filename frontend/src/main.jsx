import React from 'react';
import ReactDoom from 'react-dom/client';
import App from './App.jsx';
import './styles/tailwind.css';
import './styles/globals.css';
import { Provider } from 'react-redux';
// import { store } from './store/index.js';

ReactDoom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
      <App />
    {/* </Provider> */}
  </React.StrictMode>
)
