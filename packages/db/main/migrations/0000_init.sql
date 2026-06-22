CREATE TABLE `user_roles` (
	`user_id` integer,
	`role_name` text NOT NULL,
	PRIMARY KEY(`user_id`, `role_name`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL
);
