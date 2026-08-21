import { env as loadEnv } from "custom-env";
import { z } from "zod";

// Determine application stage
process.env.APP_STAGE = process.env.APP_STAGE || "dev";

const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTesting = process.env.APP_STAGE === "test";

// Conditionally load .env based on environment
if (isDevelopment) {
  loadEnv(); // Loads .env file
} else if (isTesting) {
  loadEnv("test"); // Loads .env.test file
}

const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  APP_STAGE: z.enum(["dev", "test", "production"]).default("dev"),

  // Server configuration
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default("localhost"),

  // Database
  DATABASE_URL: z.string().startsWith("postgresql://"),

  // JWT & Authentication
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Security
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
});

export type Env = z.infer<typeof envSchema>;

// Environment Validation and Error Handling
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  if (e instanceof z.ZodError) {
    console.error("Invalid environment variables:");

    const flattenErrorTree = z.treeifyError(e);
    console.error(JSON.stringify(flattenErrorTree, null, 2));

    // Detailed error messages
    e.issues.forEach((err) => {
      const path = err.path.join(".");
      console.error(`${path}: ${err.message}`);
    });

    process.exit(1);
  }
  throw e;
}

// Helper functions for environment checks
export const isProd = () => env.APP_STAGE === "production";
export const isDev = () => env.APP_STAGE === "dev";
export const isTest = () => env.APP_STAGE === "test";

// Export the validated environment
export { env };
export default env;
