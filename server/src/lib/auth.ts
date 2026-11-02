import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { getDB } from "../config/db.js";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;
const clientURL = process.env.CLIENT_URL || "http://localhost:3000";

if (!clientURL) {
  throw new Error("CLIENT_URL is not defined");
}

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is not defined");
}

export const auth = betterAuth({
  database: mongodbAdapter(getDB()),

  baseURL,
  secret,

  trustedOrigins: [
    clientURL,
    "http://localhost:3000",
  ],

  onAPIError: {
    errorURL: `${clientURL}/auth/login`,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: true,
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "15m",

        definePayload: ({ user }) => ({
          sub: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
        }),
      },
    }),
  ],

  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});