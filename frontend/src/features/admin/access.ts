/**
 * The admin UI has no authentication yet: the Laravel backend (Stage 8) and
 * Sanctum sign-in (Stage 9) do not exist. Until then the admin screens show
 * labelled sample data and are only served in development, or when
 * ADMIN_PREVIEW=true is set explicitly. Everywhere else /admin returns 404.
 *
 * This is NOT access control. Real protection is server-side: Laravel checks
 * the session and the user's role/permissions on every admin API call.
 */
export function isAdminPreviewEnabled() {
  return process.env.NODE_ENV === "development" || process.env.ADMIN_PREVIEW === "true"
}
