/**
 * Inyecta parámetros de optimización en una URL de Cloudinary.
 * f_auto: formato automático (WebP/AVIF para fotos, WebM/MP4 para video)
 * q_auto: calidad automática (equilibrio entre peso y visual)
 */
export const optimizeCloudinaryUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return url;
    
    // Si ya tiene parámetros de transformación, no los duplicamos de forma tosca
    if (url.includes('/upload/')) {
        return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    
    return url;
};
