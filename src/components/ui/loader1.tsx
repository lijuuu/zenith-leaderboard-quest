
import React from 'react';

const Loader1 = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: '20px'
    }}>
      <div style={{
        display: 'inline-block',
        position: 'relative',
        width: '80px',
        height: '80px'
      }}>
        <div 
          style={{
            position: 'absolute',
            border: '4px solid #22c55e',
            opacity: 1,
            borderRadius: '50%',
            animation: 'ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            border: '4px solid #22c55e',
            opacity: 1,
            borderRadius: '50%',
            animation: 'ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite',
            animationDelay: '-0.5s'
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes ripple {
            0% {
              top: 36px;
              left: 36px;
              width: 0;
              height: 0;
              opacity: 1;
            }
            100% {
              top: 0px;
              left: 0px;
              width: 72px;
              height: 72px;
              opacity: 0;
            }
          }
        `}} />
      </div>
    </div>
  );
};

export default Loader1;
