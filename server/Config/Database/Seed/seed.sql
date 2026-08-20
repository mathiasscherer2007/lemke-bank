START TRANSACTION;

-- ============================================================
-- ADDS 10 TRANSACTIONS TO ALL USERS IN USERS TABLE
-- THIS SEED WAS VIBECODED
-- ============================================================

DROP TEMPORARY TABLE IF EXISTS seed_transactions;

CREATE TEMPORARY TABLE seed_transactions (
    transaction_id VARCHAR(36) NOT NULL,
    wallet_id VARCHAR(36) NOT NULL,
    amount INT NOT NULL,
    transaction_number INT NOT NULL,
    created_at TIMESTAMP NOT NULL
);


-- ============================================================
-- Generate exactly 10 transaction IDs for every wallet.
-- ============================================================

INSERT INTO seed_transactions (
    transaction_id,
    wallet_id,
    amount,
    transaction_number,
    created_at
)
SELECT
    UUID(),
    w.id,
    CASE n.transaction_number
        WHEN 1 THEN 1000
        WHEN 2 THEN 2500
        WHEN 3 THEN 5000
        WHEN 4 THEN 1250
        WHEN 5 THEN 7500
        WHEN 6 THEN 3000
        WHEN 7 THEN 4500
        WHEN 8 THEN 2000
        WHEN 9 THEN 6000
        WHEN 10 THEN 3500
    END,
    n.transaction_number,
    TIMESTAMP('2026-08-20 10:00:00')
        + INTERVAL (n.transaction_number - 1) DAY
FROM wallets w
CROSS JOIN (
    SELECT 1 AS transaction_number
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
    UNION ALL SELECT 5
    UNION ALL SELECT 6
    UNION ALL SELECT 7
    UNION ALL SELECT 8
    UNION ALL SELECT 9
    UNION ALL SELECT 10
) n;


-- ============================================================
-- Insert the transactions.
-- ============================================================

INSERT INTO transactions (
    id,
    amount,
    charge_id,
    description,
    created_at
)
SELECT
    transaction_id,
    amount,
    NULL,
    CONCAT('Seed transaction #', transaction_number),
    created_at
FROM seed_transactions;


-- ============================================================
-- Insert exactly one ledger entry for each transaction.
--
-- counterparty_wallet_id is the same wallet because your schema
-- requires it to be NOT NULL and there is no separate system
-- wallet available from the supplied schema.
-- ============================================================

INSERT INTO ledger_entries (
    id,
    transaction_id,
    wallet_id,
    entry_type,
    amount,
    balance_before,
    balance_after,
    counterparty_wallet_id,
    created_at
)
SELECT
    UUID(),
    st.transaction_id,
    st.wallet_id,
    'credit',
    st.amount,
    0,
    st.amount,
    st.wallet_id,
    st.created_at
FROM seed_transactions st;


-- ============================================================
-- Set wallet balances to the sum of their seeded transactions.
-- ============================================================

UPDATE wallets w
JOIN (
    SELECT
        wallet_id,
        SUM(amount) AS total_amount
    FROM seed_transactions
    GROUP BY wallet_id
) s
    ON s.wallet_id = w.id
SET
    w.balance = s.total_amount,
    w.updated_at = TIMESTAMP('2026-08-20 10:00:00');


DROP TEMPORARY TABLE seed_transactions;

COMMIT;