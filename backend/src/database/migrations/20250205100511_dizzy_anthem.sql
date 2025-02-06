CREATE TABLE "courses" (
	"userId" uuid NOT NULL,
	"courseName" text NOT NULL,
	"day" text NOT NULL,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	"groupNumber" integer DEFAULT 1 NOT NULL,
	"courseDetails" jsonb DEFAULT '{}'::jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	CONSTRAINT "courses_userId_courseName_day_startTime_endTime_pk" PRIMARY KEY("userId","courseName","day","startTime","endTime")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;