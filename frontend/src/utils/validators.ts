// src/utils/validators.ts

import { VALIDATION } from './constants';

/**
 * Validar email
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validar teléfono cubano
 */
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Validar contraseña
 */
export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= VALIDATION.MIN_PASSWORD_LENGTH &&
    password.length <= VALIDATION.MAX_PASSWORD_LENGTH
  );
};

/**
 * Validar que las contraseñas coincidan
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validar nombre
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

/**
 * Validar que un string no esté vacío
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validar número positivo
 */
export const isPositiveNumber = (value: number | string): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

/**
 * Validar cantidad (entero positivo)
 */
export const isValidQuantity = (quantity: number | string): boolean => {
  const num = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
  return Number.isInteger(num) && num > 0;
};

/**
 * Validar precio
 */
export const isValidPrice = (price: number | string): boolean => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(num) && num >= 0;
};

/**
 * Validar formato de fecha (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Validar que una fecha sea futura
 */
export const isFutureDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
};

/**
 * Validar tarjeta de crédito (Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validar longitud mínima
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validar longitud máxima
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validar que contenga solo letras y espacios
 */
export const isOnlyLetters = (value: string): boolean => {
  return /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value);
};

/**
 * Validar que contenga solo números
 */
export const isOnlyNumbers = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * Validar dirección de Cuba
 */
export const isValidCubanAddress = (street: string, city: string, province: string): boolean => {
  return (
    isNotEmpty(street) &&
    street.length >= 10 &&
    isNotEmpty(city) &&
    isNotEmpty(province)
  );
};

/**
 * Obtener mensajes de error de validación
 */
export const getValidationMessage = (field: string, type: string): string => {
  const messages: Record<string, Record<string, string>> = {
    email: {
      required: 'El email es requerido',
      invalid: 'Email inválido',
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: `La contraseña debe tener al menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`,
      maxLength: `La contraseña no puede exceder ${VALIDATION.MAX_PASSWORD_LENGTH} caracteres`,
    },
    confirmPassword: {
      required: 'Confirma tu contraseña',
      noMatch: 'Las contraseñas no coinciden',
    },
    phone: {
      required: 'El teléfono es requerido',
      invalid: 'Teléfono inválido (formato: 52345678)',
    },
    name: {
      required: 'El nombre es requerido',
      minLength: 'El nombre debe tener al menos 2 caracteres',
    },
    generic: {
      required: 'Este campo es requerido',
      invalid: 'Valor inválido',
    },
  };
  
  return messages[field]?.[type] || messages.generic[type] || 'Error de validación';
};