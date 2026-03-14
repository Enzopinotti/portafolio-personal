// src/components/shared/Loader.js
import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ message, size = 'default', fullScreen = false, variant = 'primary' }) => {
    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const ringVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className={`premium-loader-container ${size} ${variant} ${fullScreen ? 'full-screen' : ''}`}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="loader-mesh">
                <motion.div
                    className="loader-ring"
                    variants={ringVariants}
                    animate="animate"
                />
                <motion.div
                    className="loader-dot"
                    variants={pulseVariants}
                    animate="animate"
                />
            </div>
            {message && <p className="loader-message">{message}</p>}
        </motion.div>
    );
};

export default Loader;
