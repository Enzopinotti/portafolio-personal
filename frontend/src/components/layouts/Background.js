// src/components/layouts/Background.js

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Background = ({ background }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={background.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="background"
        style={{ backgroundImage: `url(${background.url})` }}
      />
    </AnimatePresence>
  );
};

export default Background;
