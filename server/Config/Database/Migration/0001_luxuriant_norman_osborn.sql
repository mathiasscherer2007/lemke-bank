ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_from_wallet_id_wallets_id_fk`;
--> statement-breakpoint
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_to_wallet_id_wallets_id_fk`;
--> statement-breakpoint
ALTER TABLE `ledger_entries` MODIFY COLUMN `counterparty_wallet_id` varchar(36) NOT NULL;--> statement-breakpoint
CREATE INDEX `counterparty_wallet_idx` ON `ledger_entries` (`counterparty_wallet_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `wallets` (`user_id`);--> statement-breakpoint
ALTER TABLE `transactions` DROP COLUMN `from_wallet_id`;--> statement-breakpoint
ALTER TABLE `transactions` DROP COLUMN `to_wallet_id`;