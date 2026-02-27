import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavigationContext } from '../context/NavigationContext.js';
import { getArticles } from '../services/articleService.js';
import DeviceReels from '../components/DeviceReels.js';
import useWindowWidth from '../hooks/useWindowWidth.js';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { t } = useTranslation();
  const { navigationDirection } = useContext(NavigationContext);
  const [articulos, setArticulos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const windowWidth = useWindowWidth();

  // Definimos distintos zooms para cada dispositivo
  let iphoneZoom, samsungZoom, macZoom;
  if (windowWidth < 500) {
    iphoneZoom = 0.35;
    samsungZoom = 0.3;
    macZoom = 0.3;
  } else if (windowWidth < 800) {
    iphoneZoom = 0.55;
    samsungZoom = 0.5;
    macZoom = 0.35;
  } else if (windowWidth < 1080) {
    iphoneZoom = 0.58;
    samsungZoom = 0.55;
    macZoom = 0.38;
  } else {
    iphoneZoom = 0.6;
    samsungZoom = 0.58;
    macZoom = 0.4;
  }

  useEffect(() => {
    getArticles().then(data => setArticulos(data.articulos));
  }, []);

  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentArticles = articulos.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(articulos.length / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const variants = {
    initial: { y: navigationDirection === 'forward' ? '100vh' : '-100vh', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: navigationDirection === 'forward' ? '-100vh' : '100vh', opacity: 0 },
  };

  // Para mobile (por ejemplo, menos de 768px), usamos un solo dispositivo (iPhone X)
  const isMobile = windowWidth < 768;
  // En mobile combinamos todos los reels en un solo array.
  const combinedReels = ["/videos/reel1.mp4", "/videos/reel2.mp4", "/videos/reel1.mp4", "/videos/reel3.mp4"];

  return (
    <motion.div
      className="page blog-page"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <h1 className="blog-title">{t('blog.title')}</h1>
      <p className="blog-subtitle" dangerouslySetInnerHTML={{ __html: t('blog.subtitle').replace('tecnología', '<span class="highlight">tecnología</span>').replace('technology', '<span class="highlight">technology</span>').replace('tecnologia', '<span class="highlight">tecnologia</span>').replace('experiencias reales', '<strong>experiencias reales</strong>').replace('real experiences', '<strong>real experiences</strong>').replace('experiências reais', '<strong>experiências reais</strong>') }}>
      </p>
      <input type="text" className="blog-search" placeholder={t('blog.searchPlaceholder')} />
      <div className="blog-tags">
        <span className="tag">{t('blog.categoryDevelopment')}</span>
        <span className="tag">{t('blog.categoryDesign')}</span>
        <span className="tag">{t('blog.categoryExperience')}</span>
        <span className="tag">{t('blog.categoryTips')}</span>
      </div>

      <div className="blog-cards">
        {currentArticles.map((articulo) => (
          <div key={articulo.idArticulo} className="blog-card">
            <div className="card-img" />
            <div className="card-author">
              <img src="/img/avatar-default.jpg" alt={t('altTexts.avatar')} />
              <span>{articulo.autor}</span>
              <span className="arrow">→</span>
            </div>
            <div className="card-content">
              <h3>{articulo.titulo}</h3>
              <p>{articulo.contenido.slice(0, 120)}...</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>{t('blog.prev')}</button>
        <span>
          {t('adminProjectForm.page')} {currentPage} / {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>{t('blog.next')}</button>
      </div>

      {/* Galería de reels */}
      <div className="reels-section">
        <h2>{t('blog.reelsTitle')}</h2>
        <div className="devices-container">
          {isMobile ? (
            <div className="mobiles-container">
              <div className="mobile-title-celUno">
                <DeviceReels
                  device="iPhone X"
                  color="gold"
                  videos={combinedReels}
                  className="mobile-tall"
                  zoom={iphoneZoom}
                />
                <h3 className="apariciones-title" dangerouslySetInnerHTML={{ __html: 'Apariciones en la web – ' + t('blog.reelsSubtitle').split('|')[0] + ' <span class="text-medium">' + (t('blog.reelsSubtitle').split('|')[1] || '') + '</span>' }}>
                </h3>
              </div>
            </div>
          ) : (
            <div className="mobiles-container">
              <div className="mobile-title-celUno">
                <DeviceReels
                  device="iPhone X"
                  color="gold"
                  videos={["/videos/reel1.mp4", "/videos/reel2.mp4"]}
                  className="mobile-tall"
                  zoom={iphoneZoom}
                />
                <h3 className="apariciones-title" dangerouslySetInnerHTML={{ __html: 'Apariciones en la web – ' + t('blog.reelsSubtitle').split('|')[0] + ' <span class="text-medium">' + (t('blog.reelsSubtitle').split('|')[1] || '') + '</span>' }}>
                </h3>
              </div>
              <div className="mobile-title-celDos">
                <DeviceReels
                  device="Samsung Galaxy S5"
                  color="white"
                  videos={["/videos/reel1.mp4", "/videos/reel3.mp4"]}
                  className="mobile-short"
                  zoom={samsungZoom}
                />
                <h3 className="apariciones-title" dangerouslySetInnerHTML={{ __html: 'Celular <span class="text-white">' + t('blog.reelsAltSubtitle').split('|')[0] + '</span> – <span class="text-medium">' + (t('blog.reelsAltSubtitle').split('|')[1] || '') + '</span>' }}>
                </h3>
              </div>
            </div>
          )}
          <div className="mac-container" style={{ position: 'relative' }}>
            <h3 className="mac-apariciones-title">
              Apariciones en la web
            </h3>
            <DeviceReels
              device="MacBook Pro"
              landscape={true}
              videos={["/videos/app-demo.mp4", "/videos/app-demo2.mp4"]}
              className="mac-tilted"
              zoom={macZoom}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Blog;
