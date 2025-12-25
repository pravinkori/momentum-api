import { env as loadEnv } from "custom-env";
import { z } from "zod";

// Determine application stage
process.env.APP_STAGE = process.env.APP_STAGE || "dev";

const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTesting = process.env.APP_STAGE === "test";

// Load .env files based on environment
if (isDevelopment) {
  loadEnv(); // Loads .env
} else if (isTesting) {
  loadEnv("test"); // Loads .env.test
}

// Define validation schema with Zod
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  APP_STAGE: z.enum(["dev", "production", "test"]).default("dev"),

  // Server configuration
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default("localhost"),

  // Database
  DATABASE_URL: z.string().startsWith("postgresql://"),

  // JWT & Authentication
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Security
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
});

// Type inference from schema
export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log("Invalid env var");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));

    error.issues.forEach((err) => {
      const path = err.path.join(".");
      console.log(`${path}: ${err.message}`);
    });

    process.exit(1);
  }

  throw error;
}

export const isProd = () => env.APP_STAGE === "production";
export const isDev = () => env.APP_STAGE === "dev";
export const isTest = () => env.APP_STAGE === "test";

export { env };
export default env;
