// backend/src/controllers/productController.js
const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

// @desc    Obtener todos los productos con filtros, búsqueda y paginación
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    // Construir filtros
    const where = { is_active: true };

    // Búsqueda por nombre, descripción o tags
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search.toLowerCase()] } }
      ];
    }

    // Filtro por categoría
    if (category) {
      where.category = category;
    }

    // Filtro por rango de precio
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Filtro por stock
    if (inStock === 'true') {
      where.stock = { [Op.gt]: 0 };
    }

    // Filtro por productos destacados
    if (featured === 'true') {
      where.is_featured = true;
    }

    // Ordenamiento válido
    const validSortFields = ['price', 'createdAt', 'name', 'stock', 'sales_count', 'rating_average'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Consulta
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortField, sortOrder]],
      include: [
        {
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    // Calcular metadata de paginación
    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      total: count,
      page: parseInt(page),
      totalPages,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
      data: products
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos' 
    });
  }
};

// @desc    Obtener un producto por ID o slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar por ID o por slug
    const where = isNaN(id) 
      ? { slug: id, is_active: true } 
      : { id: parseInt(id), is_active: true };

    const product = await Product.findOne({
      where,
      include: [
        {
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Review,
          as: 'reviews',
          where: { is_approved: true },
          required: false,
          limit: 5,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: require('../models/User'),
              attributes: ['id', 'first_name', 'last_name']
            }
          ]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }

    // Incrementar contador de vistas
    await product.increment('views');

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ 
      error: 'Error al obtener producto' 
    });
  }
};

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      short_description,
      price,
      compare_price,
      cost,
      sku,
      barcode,
      stock,
      min_stock,
      category,
      category_id,
      subcategory,
      brand,
      unit,
      weight,
      dimensions,
      images,
      thumbnail,
      tags,
      features,
      is_featured,
      requires_shipping,
      tax_rate,
      meta_title,
      meta_description
    } = req.body;

    // Verificar que el SKU no exista
    const existingSku = await Product.findOne({ where: { sku } });
    if (existingSku) {
      return res.status(400).json({ 
        error: 'El SKU ya existe' 
      });
    }

    // Crear producto
    const product = await Product.create({
      name,
      description,
      short_description,
      price,
      compare_price,
      cost,
      sku,
      barcode,
      stock: stock || 0,
      min_stock: min_stock || 5,
      category,
      category_id,
      subcategory,
      brand,
      unit: unit || 'unidad',
      weight,
      dimensions,
      images: images || [],
      thumbnail,
      tags: tags || [],
      features: features || {},
      is_featured: is_featured || false,
      requires_shipping: requires_shipping !== false,
      tax_rate: tax_rate || 0,
      meta_title,
      meta_description
    });

    // Actualizar contador de productos en categoría
    if (category_id) {
      await Category.increment('products_count', { where: { id: category_id } });
    }

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ 
      error: 'Error al crear producto',
      details: error.message 
    });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }

    // Si se está cambiando el SKU, verificar que no exista
    if (updates.sku && updates.sku !== product.sku) {
      const existingSku = await Product.findOne({ 
        where: { 
          sku: updates.sku,
          id: { [Op.ne]: id }
        } 
      });
      if (existingSku) {
        return res.status(400).json({ 
          error: 'El SKU ya existe' 
        });
      }
    }

    // Actualizar producto
    await product.update(updates);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ 
      error: 'Error al actualizar producto' 
    });
  }
};

// @desc    Eliminar un producto (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }

    // Soft delete: marcar como inactivo
    await product.update({ is_active: false });

    // Decrementar contador en categoría
    if (product.category_id) {
      await Category.decrement('products_count', { 
        where: { id: product.category_id } 
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ 
      error: 'Error al eliminar producto' 
    });
  }
};

// @desc    Actualizar stock de un producto
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, operation = 'set' } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ 
        error: 'Stock inválido' 
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }

    let newStock;
    
    switch (operation) {
      case 'add':
        newStock = product.stock + parseInt(stock);
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - parseInt(stock));
        break;
      case 'set':
      default:
        newStock = parseInt(stock);
    }

    await product.update({ stock: newStock });

    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: {
        id: product.id,
        name: product.name,
        previousStock: product.stock,
        newStock,
        isLowStock: newStock <= product.min_stock
      }
    });
  } catch (error) {
    console.error('Error actualizando stock:', error);
    res.status(500).json({ 
      error: 'Error al actualizar stock' 
    });
  }
};

// @desc    Obtener productos con bajo stock
// @route   GET /api/products/low-stock
// @access  Private/Admin
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        is_active: true,
        stock: {
          [Op.lte]: require('sequelize').col('min_stock')
        }
      },
      order: [['stock', 'ASC']],
      attributes: ['id', 'name', 'sku', 'stock', 'min_stock', 'price']
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error obteniendo productos con bajo stock:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos con bajo stock' 
    });
  }
};

// @desc    Obtener productos relacionados
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }

    // Buscar productos de la misma categoría, excluyendo el actual
    const relatedProducts = await Product.findAll({
      where: {
        is_active: true,
        category: product.category,
        id: { [Op.ne]: id }
      },
      limit: parseInt(limit),
      order: [['sales_count', 'DESC']],
      attributes: ['id', 'name', 'slug', 'price', 'compare_price', 'thumbnail', 'rating_average']
    });

    res.json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts
    });
  } catch (error) {
    console.error('Error obteniendo productos relacionados:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos relacionados' 
    });
  }
};

// @desc    Obtener productos más vendidos
// @route   GET /api/products/best-sellers
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.findAll({
      where: { 
        is_active: true,
        sales_count: { [Op.gt]: 0 }
      },
      limit: parseInt(limit),
      order: [['sales_count', 'DESC']],
      attributes: ['id', 'name', 'slug', 'price', 'compare_price', 'thumbnail', 'rating_average', 'sales_count']
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error obteniendo productos más vendidos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos más vendidos' 
    });
  }
};

// @desc    Obtener productos destacados
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.findAll({
      where: { 
        is_active: true,
        is_featured: true
      },
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'slug', 'price', 'compare_price', 'thumbnail', 'rating_average']
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos destacados' 
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts,
  getRelatedProducts,
  getBestSellers,
  getFeaturedProducts
};