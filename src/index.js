
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import RijksmuseumPage from './RijksmuseumPage';
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

if (ReactDOM.createRoot) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/rijksmuseum" element={<RijksmuseumPage />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </React.StrictMode>
  );
} else {
  // Fallback για παλαιότερες εκδόσεις του React
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/rijksmuseum" element={<RijksmuseumPage />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </React.StrictMode>,
    rootElement
  );
}
