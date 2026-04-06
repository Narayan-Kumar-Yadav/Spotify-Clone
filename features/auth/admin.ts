import "server-only";

export function isAdminEmail(email?: string | null) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();

  return Boolean(email && adminEmail && email === adminEmail);
}
