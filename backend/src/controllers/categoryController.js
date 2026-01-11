// backend/src/controllers/categoryController.js
const { Op } = require('sequelize');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const { includeInactive = false, includeSubcategories = true } = req.query;

    const where = {};
    
    // Filtrar solo activas por defecto
    if (includeInactive !== 'true') {
      where.is_active = true;
    }

    const include = [];
    
    // Incluir subcategorías si se solicita
    if (includeSubcategories === 'true') {
      include.push({
        model: Category,
        as: 'subcategories',
        where: { is_active: true },
        required: false
      });
    }

    const categories = await Category.findAll({
      where,
      include,
      order: [
        ['order', 'ASC'],
        ['name', 'ASC']
      ]
    });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ 
      error: 'Error al obtener categorías' 
    });
  }
};

// @desc    Obtener una categoría por ID o slug
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar por ID o por slug
    const where = isNaN(id) 
      ? { slug: id, is_active: true } 
      : { id: parseInt(id), is_active: true };

    const category = await Category.findOne({
      where,
      include: [
        {
          model: Category,
          as: 'subcategories',
          where: { is_active: true },
          required: false
        },
        {
          model: Category,
          as: 'parent',
          required: false
        }
      ]
    });

    if (!category) {
      return res.status(404).json({ 
        error: 'Categoría no encontrada' 
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({ 
      error: 'Error al obtener categoría' 
    });
  }
};

// @desc    Obtener productos de una categoría
// @route   GET /api/categories/:id/products
// @access  Public
const getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    // Buscar categoría
    const where = isNaN(id) 
      ? { slug: id, is_active: true } 
      : { id: parseInt(id), is_active: true };

    const category = await Category.findOne({ where });

    if (!category) {
      return res.status(404).json({ 
        error: 'Categoría no encontrada' 
      });
    }

    // Obtener productos de la categoría
    const validSortFields = ['price', 'createdAt', 'name', 'sales_count', 'rating_average'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where: { 
        category_id: category.id,
        is_active: true 
      },
      limit: parseInt(limit),
      offset,
      order: [[sortField, sortOrder]]
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description
      },
      count: products.length,
      total: count,
      page: parseInt(page),
      totalPages,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
      data: products
    });
  } catch (error) {
    console.error('Error obteniendo productos de categoría:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos de la categoría' 
    });
  }
};

// @desc    Crear una nueva categoría
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      parent_id,
      image,
      icon,
      order,
      meta_title,
      meta_description
    } = req.body;

    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = await Category.findOne({ 
      where: { name } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ 
        error: 'Ya existe una categoría con ese nombre' 
      });
    }

    // Crear categoría
    const category = await Category.create({
      name,
      slug,
      description,
      parent_id,
      image,
      icon,
      order: order || 0,
      meta_title,
      meta_description
    });

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    });
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ 
      error: 'Error al crear categoría',
      details: error.message 
    });
  }
};

// @desc    Actualizar una categoría
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ 
        error: 'Categoría no encontrada' 
      });
    }

    // Si se está cambiando el nombre, verificar que no exista
    if (updates.name && updates.name !== category.name) {
      const existingCategory = await Category.findOne({ 
        where: { 
          name: updates.name,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingCategory) {
        return res.status(400).json({ 
          error: 'Ya existe una categoría con ese nombre' 
        });
      }
    }

    // Actualizar categoría
    await category.update(updates);

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ 
      error: 'Error al actualizar categoría' 
    });
  }
};

// @desc    Eliminar una categoría (soft delete)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ 
        error: 'Categoría no encontrada' 
      });
    }

    // Verificar si tiene productos
    const productsCount = await Product.count({ 
      where: { category_id: id } 
    });

    if (productsCount > 0) {
      return res.status(400).json({ 
        error: `No se puede eliminar. La categoría tiene ${productsCount} producto(s) asociado(s)` 
      });
    }

    // Soft delete: marcar como inactiva
    await category.update({ is_active: false });

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ 
      error: 'Error al eliminar categoría' 
    });
  }
};

// @desc    Obtener árbol de categorías (jerárquico)
// @route   GET /api/categories/tree
// @access  Public
const getCategoryTree = async (req, res) => {
  try {
    // Obtener todas las categorías principales (sin padre)
    const mainCategories = await Category.findAll({
      where: { 
        parent_id: null,
        is_active: true 
      },
      include: [{
        model: Category,
        as: 'subcategories',
        where: { is_active: true },
        required: false,
        separate: true,
        order: [['order', 'ASC'], ['name', 'ASC']]
      }],
      order: [['order', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      count: mainCategories.length,
      data: mainCategories
    });
  } catch (error) {
    console.error('Error obteniendo árbol de categorías:', error);
    res.status(500).json({ 
      error: 'Error al obtener árbol de categorías' 
    });
  }
};

// @desc    Obtener estadísticas de categorías
// @route   GET /api/categories/stats
// @access  Private/Admin
const getCategoryStats = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'products_count'],
      order: [['products_count', 'DESC']],
      limit: 10
    });

    const totalCategories = await Category.count({ 
      where: { is_active: true } 
    });
    
    const emptyCategories = await Category.count({ 
      where: { 
        is_active: true,
        products_count: 0 
      } 
    });

    res.json({
      success: true,
      data: {
        total: totalCategories,
        withProducts: totalCategories - emptyCategories,
        empty: emptyCategories,
        topCategories: categories
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas' 
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getCategoryStats
};