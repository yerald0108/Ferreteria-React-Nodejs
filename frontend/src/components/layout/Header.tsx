// src/components/layout/Header.tsx

import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useState } from 'react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Ferretería</h1>
              <p className="text-xs text-gray-500">Todo para tu hogar</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <button 
              onClick={toggleCart}
              className="relative group"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-orange-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition"
                >
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </div>
                  <span className="hidden md:block">{user.first_name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link 
                      to={ROUTES.PROFILE}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to={ROUTES.ORDERS}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mis Órdenes
                    </Link>
                    <Link 
                      to={ROUTES.ADDRESSES}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Direcciones
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to={ROUTES.LOGIN} className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden md:block">Ingresar</span>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200 py-3">
          <ul className="flex items-center space-x-6 text-sm">
            <li>
              <Link to={ROUTES.PRODUCTS} className="text-gray-600 hover:text-orange-500 transition font-medium">
                Todos los Productos
              </Link>
            </li>
            <li>
              <Link to="/category/herramientas-manuales" className="text-gray-600 hover:text-orange-500 transition">
                Herramientas Manuales
              </Link>
            </li>
            <li>
              <Link to="/category/herramientas-electricas" className="text-gray-600 hover:text-orange-500 transition">
                Herramientas Eléctricas
              </Link>
            </li>
            <li>
              <Link to="/category/pinturas" className="text-gray-600 hover:text-orange-500 transition">
                Pinturas
              </Link>
            </li>
            <li>
              <Link to="/category/plomeria" className="text-gray-600 hover:text-orange-500 transition">
                Plomería
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;