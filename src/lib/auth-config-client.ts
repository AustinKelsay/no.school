/**
 * Client-safe auth configuration
 * 
 * This file exports only the parts of auth configuration that are safe
 * to use on the client side, avoiding server-only dependencies
 */

import authConfig from '../../config/auth.json'

// Export only the client-safe parts of the auth configuration
export const authConfigClient = {
  features: authConfig.features,
  copy: authConfig.copy,
  pages: authConfig.pages,
}