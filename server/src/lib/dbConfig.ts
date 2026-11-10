/*
 * Serverless platforms start many short-lived instances, so each instance
 * keeps its database pools small. Override with DB_POOL_MAX if needed.
 */
export const DB_POOL_MAX =
  Number(process.env.DB_POOL_MAX) || (process.env.VERCEL ? 3 : 10);
