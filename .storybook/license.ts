/**
 * License configuration for Storybook
 * This is only used for Storybook deployment, not for local development or production use
 */

/**
 * Get the license key from environment variables for Storybook
 * In Storybook deployment, this comes from GitHub Secrets
 * Local development doesn't need a license key
 */
export const getVirtuosoLicenseKey = (): string => {
  // Vite exposes env variables with VITE_ prefix
  return import.meta.env.VITE_VIRTUOSO_LICENSE_KEY || '';
};
