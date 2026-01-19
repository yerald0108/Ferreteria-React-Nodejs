// backend/src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categories');
const { protect, admin } = require('../middleware/auth');

// Validaciones
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
];

// ============================================
// RUTAS PÚBLICAS
// ============================================

// @route   GET /api/categories/tree
// @desc    Obtener árbol jerárquico de categorías
router.get('/tree', getCategoryTree);

// @route   GET /api/categories
// @desc    Listar todas las categorías
router.get('/', getCategories);

// @route   GET /api/categories/:id
// @desc    Obtener una categoría por ID o slug
router.get('/:id', getCategoryById);

// @route   GET /api/categories/:id/products
// @desc    Obtener productos de una categoría
router.get('/:id/products', getCategoryProducts);

// ============================================
// RUTAS PROTEGIDAS (ADMIN)
// ============================================

// @route   GET /api/categories/admin/stats
// @desc    Obtener estadísticas de categorías
router.get('/admin/stats', protect, admin, getCategoryStats);

// @route   POST /api/categories
// @desc    Crear una nueva categoría
router.post('/', protect, admin, categoryValidation, createCategory);

// @route   PUT /api/categories/:id
// @desc    Actualizar una categoría
router.put('/:id', protect, admin, updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Eliminar una categoría (soft delete)
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;