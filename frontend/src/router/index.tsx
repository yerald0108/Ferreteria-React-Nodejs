// src/router/index.tsx

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from '../utils/constants';

// Layout components
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PrivateRoute from './PrivateRoute';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Product pages
const ProductsList = lazy(() => import('../pages/products/ProductsList'));
const ProductDetail = lazy(() => import('../pages/products/ProductDetail'));

// Category pages
const CategoryPage = lazy(() => import('../pages/categories/CategoryPage'));

// Cart & Checkout
const CartPage = lazy(() => import('../pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'));
const OrderSuccess = lazy(() => import('../pages/checkout/OrderSuccess'));

// User Profile
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const OrdersPage = lazy(() => import('../pages/profile/OrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/profile/OrderDetailPage'));
const AddressesPage = lazy(() => import('../pages/profile/AddressesPage'));

// 404 Not Found
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * Wrapper para lazy loaded components con Suspense
 */
const LazyLoad = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    {children}
  </Suspense>
);

/**
 * Router configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyLoad>
            <Home />
          </LazyLoad>
        ),
      },
      
      // Auth routes
      {
        path: ROUTES.LOGIN,
        element: (
          <LazyLoad>
            <Login />
          </LazyLoad>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <LazyLoad>
            <Register />
          </LazyLoad>
        ),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: (
          <LazyLoad>
            <ForgotPassword />
          </LazyLoad>
        ),
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: (
          <LazyLoad>
            <ResetPassword />
          </LazyLoad>
        ),
      },
      
      // Product routes
      {
        path: ROUTES.PRODUCTS,
        element: (
          <LazyLoad>
            <ProductsList />
          </LazyLoad>
        ),
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        element: (
          <LazyLoad>
            <ProductDetail />
          </LazyLoad>
        ),
      },
      
      // Category routes
      {
        path: ROUTES.CATEGORY,
        element: (
          <LazyLoad>
            <CategoryPage />
          </LazyLoad>
        ),
      },
      
      // Cart & Checkout
      {
        path: ROUTES.CART,
        element: (
          <LazyLoad>
            <CartPage />
          </LazyLoad>
        ),
      },
      {
        path: ROUTES.CHECKOUT,
        element: (
          <LazyLoad>
            <CheckoutPage />
          </LazyLoad>
        ),
      },
      {
        path: ROUTES.ORDER_SUCCESS,
        element: (
          <LazyLoad>
            <OrderSuccess />
          </LazyLoad>
        ),
      },
      
      // Profile routes (protected)
      {
        path: ROUTES.PROFILE,
        element: (
          <PrivateRoute>
            <LazyLoad>
              <ProfilePage />
            </LazyLoad>
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.ORDERS,
        element: (
          <PrivateRoute>
            <LazyLoad>
              <OrdersPage />
            </LazyLoad>
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.ORDER_DETAIL,
        element: (
          <PrivateRoute>
            <LazyLoad>
              <OrderDetailPage />
            </LazyLoad>
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.ADDRESSES,
        element: (
          <PrivateRoute>
            <LazyLoad>
              <AddressesPage />
            </LazyLoad>
          </PrivateRoute>
        ),
      },
      
      // 404
      {
        path: '/404',
        element: (
          <LazyLoad>
            <NotFound />
          </LazyLoad>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);