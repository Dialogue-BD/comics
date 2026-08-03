CREATE TABLE `poll_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`poll_window` text NOT NULL,
	`response_token` text NOT NULL,
	`primary_emotion` text NOT NULL,
	`emotion` text NOT NULL,
	`reason` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `poll_responses_window_token_idx` ON `poll_responses` (`poll_window`,`response_token`);