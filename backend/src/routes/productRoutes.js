// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();

// Por ahora rutas vacías, las implementaremos después
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint de productos - Próximamente',
    products: []
  });
});

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Detalle de producto - Próximamente',
    product: null
  });
});

module.exports = router;