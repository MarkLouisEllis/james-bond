import { integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const pings = pgTable('pings', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Ping = typeof pings.$inferSelect;
export type NewPing = typeof pings.$inferInsert;
