CREATE TABLE "pings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"parent_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
