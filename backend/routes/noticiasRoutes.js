import { Router } from 'express';
import { getLatestNoticias } from '../controllers/noticiaController.js';

const router = Router();

router.get('/', getLatestNoticias);

export default router;
