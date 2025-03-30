// filepath: /Users/marios/GitHub/art-wallpaper-app/src/components/RefreshButton.js
import React from 'react';

const RefreshButton = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button onClick={handleRefresh} style={styles.button}>
      🔄
    </button>
  );
};

const styles = {
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    color: '#555',
    position: 'fixed',
    bottom: '50px', // Αλλάξτε την απόσταση από το κάτω μέρος της οθόνης
    right: '10px', // Αφήστε το κουμπί στη δεξιά πλευρά
    zIndex: 1000, // Βεβαιωθείτε ότι το κουμπί είναι πάνω από άλλα στοιχεία
  },
};

export default RefreshButton;