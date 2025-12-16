import { Auth0Client } from "@auth0/nextjs-auth0/server";

const ALLOWED_EMAILS = process.env.ALLOWED_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

export const auth0 = new Auth0Client({
  appBaseUrl: process.env.APP_BASE_URL,
});

export function isAllowedUser(email: string | undefined | null): boolean {
  if (!email) return false;
  if (ALLOWED_EMAILS.length === 0) return true;
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}
