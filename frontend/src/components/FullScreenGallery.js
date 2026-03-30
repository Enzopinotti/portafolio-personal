import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Mousewheel } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryUtils.js';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FullScreenGallery = ({ isOpen, items, initialIndex, onClose }) => {
    // Manejo de tecla ESC
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    const renderMedia = (item) => {
        const isVideo = 
            item.ruta?.toLowerCase().match(/\.(mp4|webm|mov|ogg|quicktime)$/) || 
            item.ruta?.includes('/video/upload/');

        const optimizedUrl = optimizeCloudinaryUrl(item.ruta);

        if (isVideo) {
            return (
                <video
                    src={optimizedUrl}
                    controls
                    autoPlay
                    className="fullscreen-media"
                    onClick={(e) => e.stopPropagation()}
                />
            );
        }
        return (
            <img
                src={optimizedUrl}
                alt={item.descripcion || 'Imagen Fullscreen'}
                className="fullscreen-media"
                onClick={(e) => e.stopPropagation()}
            />
        );
    };

    const renderContent = () => (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fullscreen-gallery-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <button className="close-btn" onClick={onClose}>
                        <IoCloseOutline />
                    </button>

                    <div className="fullscreen-swiper-container" onClick={(e) => e.stopPropagation()}>
                        <Swiper
                            modules={[Navigation, Pagination, Keyboard, Mousewheel]}
                            initialSlide={initialIndex}
                            navigation={{
                                prevEl: '.fs-prev',
                                nextEl: '.fs-next',
                            }}
                            pagination={{ clickable: true, type: 'fraction' }}
                            keyboard={{ enabled: true }}
                            mousewheel={true}
                            spaceBetween={50}
                            slidesPerView={1}
                            className="fullscreen-swiper"
                        >
                            {items.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className="fs-slide-content">
                                        {renderMedia(item)}
                                        {item.descripcion && (
                                            <p className="fs-caption">{item.descripcion}</p>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button className="fs-nav-btn fs-prev">
                            <IoArrowBackOutline />
                        </button>
                        <button className="fs-nav-btn fs-next">
                            <IoArrowForwardOutline />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(renderContent(), document.body);
};

export default FullScreenGallery;
