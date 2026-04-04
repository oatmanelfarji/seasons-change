CREATE TYPE "public"."category" AS ENUM('national', 'religious', 'family', 'personal', 'work', 'astronomical', 'other');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('national', 'religious', 'international', 'other');--> statement-breakpoint
CREATE TABLE "astronomical_houses" (
	"id" serial PRIMARY KEY NOT NULL,
	"season" text NOT NULL,
	"period" text,
	"english_period" text,
	"house_name" text NOT NULL,
	"english_name" text,
	"start_date" text NOT NULL,
	"duration" integer NOT NULL,
	"description" text,
	"zodiac_sign_names" text[],
	"zodiac_sign_names_ar" text[],
	"zodiac_start_days" integer[],
	"zodiac_end_days" integer[],
	CONSTRAINT "duration_check" CHECK (("astronomical_houses"."duration" = 13) OR ("astronomical_houses"."id" IN (7, 22) AND "astronomical_houses"."duration" = 14))
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"is_all_day" boolean DEFAULT false,
	"location" text,
	"country_code" text,
	"category" "category" DEFAULT 'personal',
	"reminders" jsonb,
	"user_id" text,
	"sync_id" text,
	"source" text DEFAULT 'local',
	"etag" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "holidays" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"local_name" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"country_code" text NOT NULL,
	"type" "type",
	"description" text
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"year" text NOT NULL,
	"country_code" text
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"is_done" boolean DEFAULT false,
	"date" timestamp,
	"user_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "zodiac_signs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"iso3" text NOT NULL,
	"iso2" text NOT NULL,
	"numeric_code" text,
	"phonecode" text,
	"capital" text,
	"currency" text,
	"currency_name" text,
	"currency_symbol" text,
	"tld" text,
	"native" text,
	"region" text,
	"subregion" text,
	"nationality" text,
	"timezones" jsonb,
	"translations" jsonb,
	"latitude" text,
	"longitude" text,
	"emoji" text,
	"emojiU" text,
	"wiki_data_id" text,
	"population" integer,
	"gdp" integer,
	"region_id" integer,
	"subregion_id" integer,
	"area_sq_km" integer,
	"postal_code_format" text,
	"postal_code_regex" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "countries_iso3_unique" UNIQUE("iso3"),
	CONSTRAINT "countries_iso2_unique" UNIQUE("iso2")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"country_code" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_country_code_countries_iso2_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("iso2") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_country_code_countries_iso2_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("iso2") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_country_code_countries_iso2_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("iso2") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_country_code_countries_iso2_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("iso2") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_start_time_idx" ON "events" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "events_user_id_idx" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "events_country_idx" ON "events" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "holidays_country_start_date_idx" ON "holidays" USING btree ("country_code","start_date");--> statement-breakpoint
CREATE INDEX "seasons_country_idx" ON "seasons" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "todos_date_idx" ON "todos" USING btree ("date");--> statement-breakpoint
CREATE INDEX "todos_user_id_idx" ON "todos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "zodiac_signs_idx" ON "zodiac_signs" USING btree ("name");--> statement-breakpoint
CREATE INDEX "countries_name_idx" ON "countries" USING btree ("name");--> statement-breakpoint
CREATE INDEX "countries_region_idx" ON "countries" USING btree ("region");--> statement-breakpoint
CREATE INDEX "user_country_idx" ON "user" USING btree ("country_code");