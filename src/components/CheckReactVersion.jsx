import React from 'react';
import ReactDOM from 'react-dom';

// Function to check React version
const CheckReactVersion = () => {
  return (
    <div style={{ padding: '10px', backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '5px' }}>
      <p><strong>React Version:</strong> {React.version}</p>
      <p><strong>React DOM Version:</strong> {ReactDOM.version}</p>
    </div>
  );
};

export default CheckReactVersion;