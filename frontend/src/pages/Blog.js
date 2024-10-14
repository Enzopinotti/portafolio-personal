// src/pages/Blog.js

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';

const Blog = () => {
  const { navigationDirection } = useContext(NavigationContext);

  const variants = {
    initial: {
      y: navigationDirection === 'forward' ? '100vh' : '-100vh',
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: navigationDirection === 'forward' ? '-100vh' : '100vh',
      opacity: 0,
    },
  };

  return (
    <motion.div
      className="page blog-page"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <h1>Blog</h1>
      <p>Bienvenido a mi blog.</p>
    </motion.div>
  );
};

export default Blog;
