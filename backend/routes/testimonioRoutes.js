import { Router } from 'express';
import { 
  crearTestimonio, 
  listarTestimonios, 
  verTestimonio, 
  editarTestimonio, 
  eliminarTestimonio, 
  listarTestimoniosDeUsuario
} from '../controllers/testimonioController.js';
// import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// GET todos los testimonios
router.get('/', listarTestimonios);
// GET testimonio por ID
router.get('/:id', verTestimonio);
// POST crear testimonio (podrías requerir autenticación)
router.post('/', crearTestimonio);
// PUT editar testimonio
router.put('/:id', editarTestimonio);
// DELETE eliminar testimonio
router.delete('/:id', eliminarTestimonio);

router.get('/usuario/:idUsuario', listarTestimoniosDeUsuario);

export default router;
