const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export const googleClientId = GOOGLE_CLIENT_ID.trim();

export const isGoogleClientConfigured =
  Boolean(googleClientId) &&
  !googleClientId.toLowerCase().includes("your") &&
  googleClientId.endsWith(".apps.googleusercontent.com");

