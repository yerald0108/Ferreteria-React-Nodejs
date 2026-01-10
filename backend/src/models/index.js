// backend/src/models/index.js
// Exporta todos los modelos desde un solo lugar

const { sequelize } = require('../config/database');

// Importar modelos
const User = require('./User');
const Address = require('./Address');
const Product = require('./Product');
const Category = require('./Category');
const Review = require('./Review');
const { Cart, CartItem } = require('./Cart');
const { Order, OrderItem, OrderStatusHistory } = require('./Order');

// Establecer relación Product-Category (muchos a uno)
Product.belongsTo(Category, { 
  foreignKey: 'category_id',
  as: 'categoryInfo'
});
Category.hasMany(Product, { 
  foreignKey: 'category_id',
  as: 'products'
});

// Exportar todos los modelos y la instancia de sequelize
module.exports = {
  sequelize,
  User,
  Address,
  Product,
  Category,
  Review,
  Cart,
  CartItem,
  Order,
  OrderItem,
  OrderStatusHistory
};