import React from 'react';
import { createRoot } from 'react-dom/client'; // Σωστή εισαγωγή
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }

    return this.props.children;
  }
}

// Χρήση createRoot για React 18+
const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Χρήση της σωστής μεθόδου

root.render(
  <React.StrictMode>
    <Router>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Router>
  </React.StrictMode>
);
