
import "server-only";

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import * as dns from "node:dns";

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME || "socialimpact";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log("DNS SERVERS:", dns.getServers());

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined");
}



if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is not defined");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

dns.promises.resolveSrv(
  "_mongodb._tcp.project-01.idyu1cl.mongodb.net"
).then((records) => {
  console.log("MONGODB SRV:", records);
}).catch((error) => {
  console.error("MONGODB DNS ERROR:", error);
});

const client =
  globalForMongo.mongoClient ?? new MongoClient(mongoUri);

globalForMongo.mongoClient = client;

const db = client.db(databaseName);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  baseURL,
  secret,

  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
  ],

  onAPIError: {
    errorURL: `${baseURL}/auth/login`,
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
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
});
