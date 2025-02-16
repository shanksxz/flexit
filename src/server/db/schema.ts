import { relations, sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTableCreator,
	text,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `flexit_${name}`);

export const users = createTable("users", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).unique().notNull(),
	emailVerified: boolean("email_verified").default(false),
	image: varchar("image", { length: 255 }),
	username: varchar("username", { length: 255 }).unique(),
	bio: text("bio"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = createTable("sessions", {
	id: varchar("id", { length: 255 }).primaryKey(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	token: varchar("token", { length: 255 }).unique().notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	ipAddress: varchar("ip_address", { length: 255 }).notNull(),
	userAgent: text("user_agent").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
		relationName: "user",
	}),
}));

export const accounts = createTable(
	"accounts",
	{
		id: varchar("id", { length: 255 }).primaryKey(),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accountId: varchar("account_id", { length: 255 }).notNull(),
		providerId: varchar("provider_id", { length: 255 }).notNull(),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => ({
		uniqueConstraint: unique().on(table.providerId, table.accountId),
	}),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
		relationName: "user",
	}),
}));

export const verifications = createTable(
	"verifications",
	{
		id: varchar("id", { length: 255 }).primaryKey(),
		identifier: varchar("identifier", { length: 255 }).notNull(),
		value: varchar("value", { length: 255 }).notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => ({ uniqueConstraint: unique().on(table.identifier, table.value) }),
);

export const posts = createTable(
	"post",
	{
		id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
		name: varchar("name", { length: 256 }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(example) => ({
		nameIndex: index("name_idx").on(example.name),
	}),
);
