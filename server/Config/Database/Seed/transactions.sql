-- ==========================================================
-- TRANSACTIONS
-- ==========================================================

INSERT INTO transactions (
    id,
    amount,
    description,
    charge_id,
    created_at
) VALUES
(
    'tx_001',
    100.00,
    'Transferência para Bob',
    NULL,
    '2026-08-01 09:15:00'
),
(
    'tx_002',
    125.00,
    'Transferência para Bob e Carol',
    NULL,
    '2026-08-01 14:30:00'
),
(
    'tx_003',
    30.00,
    'Devolução para Alice',
    NULL,
    '2026-08-02 10:00:00'
),
(
    'tx_004',
    200.00,
    'Transferência para Alice',
    NULL,
    '2026-08-03 11:45:00'
),
(
    'tx_005',
    150.00,
    'Transferência para Bob',
    NULL,
    '2026-08-03 16:20:00'
),
(
    'tx_006',
    300.00,
    'Transferência para Bob e Carol',
    NULL,
    '2026-08-05 13:10:00'
),
(
    'tx_007',
    80.00,
    'Transferência para Carol',
    NULL,
    '2026-08-07 09:40:00'
),
(
    'tx_008',
    50.00,
    'Devolução para Bob',
    NULL,
    '2026-08-10 18:00:00'
);