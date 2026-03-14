// backend/routes/noticias.js
const { Router } = require('express');
const { getLatestNoticias } = require('../controllers/noticiaController');

const router = Router();

router.get('/', getLatestNoticias);

module.exports = router;
