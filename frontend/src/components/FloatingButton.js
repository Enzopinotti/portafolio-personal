// src/components/FloatingButton.js

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const FloatingButton = () => {
  const cvUrl = 'https://drive.google.com/file/d/1eYc4tb8TOkK5LXdhhGaMPOTtqEt8ydIV/view?usp=sharing';

  return (
    <div className="floating-button">
      <div className="qr-code">
        <QRCodeSVG value={cvUrl} size={128} />
      </div>
    </div>
  );
};

export default FloatingButton;


