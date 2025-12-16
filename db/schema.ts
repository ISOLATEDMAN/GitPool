import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// CHANGE: Export as 'users' (plural), table name is 'users'
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    githubId: integer('github_id').unique().notNull(),
    username: text('user_name').notNull(),
    avatarUrl: text('avatar_url'),
    isActive: boolean('is_active').default(true).notNull()
});

export const repositories = pgTable('repositories', {
    id: serial('id').primaryKey(),
    githubId: integer('github_id').unique().notNull(),
    name: text("repo_name").notNull(),
    orgName: text("org_name").notNull() // Fixed casing standard
});

export const activities = pgTable('activities', { // Fixed spelling 'activities'
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    repositoryId: integer('repository_id').references(() => repositories.id).notNull(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    refId: text('refId').notNull(),
    points: integer('points').default(1),

    // NEW COLUMNS FOR LOC
    additions: integer('additions').default(0),
    deletions: integer('deletions').default(0),

    createdAt: timestamp('created_at').defaultNow()
});