// src/components/layouts/Telefono.js

import React from 'react';

const Telefono = () => {
  const phoneLabel = '+54 9 2346 304036';
  const whatsappUrl = 'https://wa.me/5492346304036';

  return (
    <div className="telefono">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
        {phoneLabel}
      </a>
    </div>
  );
};

export default Telefono;
