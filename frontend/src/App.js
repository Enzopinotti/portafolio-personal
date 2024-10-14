// src/App.js

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/layouts/Layout.js';
import NavigationProvider from './context/NavigationContext.js';

function App() {
  return (
    <Router>
      <NavigationProvider>
        <Layout />
      </NavigationProvider>
    </Router>
  );
}

export default App;
