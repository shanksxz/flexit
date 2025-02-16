import { env } from "@/env.js";
import { accounts, sessions, users, verifications } from "@/server/db/schema";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: users,
			session: sessions,
			account: accounts,
			verification: verifications,
		},
	}),
	socialProviders: {
		github: {
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET,
		},
	},
	user: {
		additionalFields: {
			username: {
				type: "string",
				unique: true,
			},
		},
	},
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
