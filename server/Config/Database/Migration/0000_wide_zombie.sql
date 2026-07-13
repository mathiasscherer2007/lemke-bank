CREATE TABLE `charges` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`issuer_wallet_id` varchar(36) NOT NULL,
	`amount` int NOT NULL,
	`description` text,
	`status` enum('open','paid','expired') NOT NULL DEFAULT 'open',
	`expires_at` timestamp,
	`payer_wallet_id` varchar(36),
	`payment_transaction_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`paid_at` timestamp,
	CONSTRAINT `charges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ledger_entries` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`transaction_id` varchar(36) NOT NULL,
	`wallet_id` varchar(36) NOT NULL,
	`entry_type` enum('debit','credit') NOT NULL,
	`amount` int NOT NULL,
	`balance_before` int,
	`balance_after` int,
	`counterparty_wallet_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ledger_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`amount` int NOT NULL,
	`from_wallet_id` varchar(36) NOT NULL,
	`to_wallet_id` varchar(36) NOT NULL,
	`charge_id` varchar(36),
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`email` varchar(320) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`username` varchar(128) NOT NULL,
	`status` enum('active','disabled') NOT NULL DEFAULT 'active',
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`user_id` varchar(36) NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`status` enum('active','disabled') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `charges` ADD CONSTRAINT `charges_issuer_wallet_id_wallets_id_fk` FOREIGN KEY (`issuer_wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `charges` ADD CONSTRAINT `charges_payer_wallet_id_wallets_id_fk` FOREIGN KEY (`payer_wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ledger_entries` ADD CONSTRAINT `ledger_entries_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ledger_entries` ADD CONSTRAINT `ledger_entries_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ledger_entries` ADD CONSTRAINT `ledger_entries_counterparty_wallet_id_wallets_id_fk` FOREIGN KEY (`counterparty_wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_from_wallet_id_wallets_id_fk` FOREIGN KEY (`from_wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_to_wallet_id_wallets_id_fk` FOREIGN KEY (`to_wallet_id`) REFERENCES `wallets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_charge_id_charges_id_fk` FOREIGN KEY (`charge_id`) REFERENCES `charges`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `wallet_idx` ON `ledger_entries` (`wallet_id`);--> statement-breakpoint
CREATE INDEX `transaction_idx` ON `ledger_entries` (`transaction_id`);