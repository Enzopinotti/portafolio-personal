import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-coverflow';
import FullScreenGallery from './FullScreenGallery.js';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryUtils.js';

const ProyectoGallery = ({ items = [] }) => {
    const [fsOpen, setFsOpen] = React.useState(false);
    const [fsIndex, setFsIndex] = React.useState(0);

    if (!items || items.length === 0) return null;

    const openFs = (index) => {
        setFsIndex(index);
        setFsOpen(true);
    };

    const renderMedia = (item, isSingle = false) => {
        // Detectar si es video: por extensión (incluyendo .mov) o si la URL de Cloudinary contiene /video/upload/
        const isVideo = 
            item.ruta?.toLowerCase().match(/\.(mp4|webm|mov|ogg|quicktime)$/) || 
            item.ruta?.includes('/video/upload/');

        const optimizedUrl = optimizeCloudinaryUrl(item.ruta);

        const commonStyles = {
            width: '100%',
            height: '100%',
            maxHeight: '600px',
            objectFit: 'contain',
            display: 'block',
            borderRadius: '12px'
        };

        if (isVideo) {
            return (
                <div className="media-wrapper video-wrapper">
                    <video
                        src={optimizedUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={optimizedUrl.replace(/\.(mp4|webm|mov|ogg)$/i, '.webp')}
                        style={commonStyles}
                        ref={(el) => {
                            if (el) {
                                el.muted = true;
                                el.playsInline = true;
                                const p = el.play();
                                if (p !== undefined) p.catch(() => { });
                            }
                        }}
                    />
                </div>
            );
        }

        return (
            <div className="media-wrapper image-wrapper">
                <img
                    src={optimizedUrl}
                    alt={item.descripcion || 'Media del Proyecto'}
                    style={commonStyles}
                    loading="lazy"
                />
            </div>
        );
    };

    if (items.length === 1) {
        return (
            <div className="proyecto-gallery single-item-view">
                {renderMedia(items[0], true)}
            </div>
        );
    }

    // Configuración dinámica según cantidad de items
    const isSpecial = items.length >= 3;

    // Si tenemos pocos items (3-5), multiplicamos para que el modo Coverflow muestre siempre los lados
    const displayItems = isSpecial && items.length < 6
        ? [...items, ...items, ...items]
        : items;

    return (
        <div className={`proyecto-gallery ${isSpecial ? 'gallery-animated' : 'carousel-view'}`}>
            <Swiper
                key={displayItems.length}
                modules={[Navigation, Pagination, EffectFade, EffectCoverflow, Autoplay]}
                navigation={true}
                pagination={{ clickable: true }}
                loop={true}
                watchSlidesProgress={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false
                }}
                // Efecto Coverflow solo si hay 3+ items
                effect={isSpecial ? 'coverflow' : 'slide'}
                coverflowEffect={{
                    rotate: 30,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                centeredSlides={isSpecial}
                slidesPerView={isSpecial ? 'auto' : 1}
                spaceBetween={isSpecial ? 0 : 30}
                grabCursor={true}
                className="mySwiper"
            >
                {displayItems.map((item, index) => (
                    <SwiperSlide
                        key={index}
                        style={isSpecial ? { width: '80%' } : {}}
                        onClick={() => openFs(index % items.length)}
                    >
                        {renderMedia(item)}
                    </SwiperSlide>
                ))}
            </Swiper>

            <FullScreenGallery
                isOpen={fsOpen}
                items={items}
                initialIndex={fsIndex}
                onClose={() => setFsOpen(false)}
            />
        </div>
    );
};

export default ProyectoGallery;
