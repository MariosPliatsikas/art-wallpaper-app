import React from 'react';

const RefreshButton = ({ hidden, onRefresh }) => {
  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  return (
    <button
      onClick={handleRefresh}
      aria-label="Refresh artwork"
      style={{
        ...styles.button,
        display: hidden ? 'none' : 'block',
      }}
    >
      🔄
    </button>
  );
};

const styles = {
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '42px',
    color: '#555',
    position: 'fixed',
    bottom: '50px',
    right: '10px',
    zIndex: 1000,
  },
};

export default RefreshButton;
