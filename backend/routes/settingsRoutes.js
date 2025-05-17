// routes/settingsRoutes.js
import { Router } from 'express';
import { getSettingsController, importarFlexibleDesdeSheetController, updateSettingsController } from '../controllers/adminSettingsController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { verificarRolAdmin } from '../middleware/rolMiddleware.js';

const router = Router();

// GET /api/settings -> obtener settings (no se requiere token, o puede protegerse según tu necesidad)
router.get('/', getSettingsController);

// PUT /api/settings -> actualizar settings (protegido)
router.put('/', verificarToken, verificarRolAdmin, updateSettingsController);

router.post('/importar-datos', verificarToken, verificarRolAdmin, importarFlexibleDesdeSheetController);

export default router;
