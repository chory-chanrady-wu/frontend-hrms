// lib/permissions.ts
export function hasPermission(permissions: string[], permission: string) {
  // If user has 'admin', allow everything
  if (permissions.includes("admin")) return true;
  return permissions.includes(permission);
}
