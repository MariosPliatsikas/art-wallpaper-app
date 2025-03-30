// filepath: /Users/marios/GitHub/art-wallpaper-app/src/components/RefreshButton.js
import React from 'react';

const RefreshButton = ({ hidden }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={handleRefresh}
      style={{
        ...styles.button,
        display: hidden ? 'none' : 'block', // Εμφάνιση/Απόκρυψη του κουμπιού
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
    fontSize: '32px', // Αυξήστε το μέγεθος του κουμπιού
    color: '#555',
    position: 'fixed',
    bottom: '50px', // Απόσταση από το κάτω μέρος της οθόνης
    right: '10px', // Απόσταση από τη δεξιά πλευρά
    zIndex: 1000, // Βεβαιωθείτε ότι το κουμπί είναι πάνω από άλλα στοιχεία
  },
};

export default RefreshButton;