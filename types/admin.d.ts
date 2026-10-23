/**
 * TypeScript Type Definitions for Car Castle Goa Admin Panel & Auth
 */

export interface AdminUserSession {
  email: string;
  uid: string;
  displayName: string;
  isDemo?: boolean;
}

export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
