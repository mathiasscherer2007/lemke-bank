# Error Codes

The API exposes these stable error codes through the `code` property of thrown
exceptions. Frontend clients should use the code to select a user-facing
message or action, rather than matching the exception message.

| Code | Explanation |
| --- | --- |
| `SERVICE_PROVIDER_MISSING` | A required service provider could not be resolved by the application container. |
| `CACHE_PROVIDER_ERROR` | The cache provider encountered an unexpected error. |
| `BUSINESS_DAY_ERROR` | The external business-day verification service did not respond. |
| `UNBALANCED_TRANSACTION` | The transaction's total credits do not equal its total debits. |
| `MISSING_LEDGER_TYPE` | The transaction is missing either a credit or a debit entry. |
| `TRANSACTION_NOT_FOUND` | The requested transaction could not be found. |
| `SAME_WALLETS` | The transaction origin and destination wallets are the same. |
| `INSUFFICIENT_FUNDS` | The source wallet does not have enough funds to complete the transaction. |
| `WALLET_NOT_FOUND` | The requested wallet could not be found. |
| `NOT_BUSINESS_DAY` | Transactions cannot be made on the current day. |
| `CHARGE_NOT_FOUND` | The requested charge could not be found. |
| `CHARGE_UNAVAILABLE` | The charge has already been paid or has expired. |
| `CHARGE_NOT_PAID` | A transaction cannot be attached because the charge has not been paid. |
| `CHARGE_ALREADY_ATTACHED` | The charge already has a transaction attached to it. |
| `ISSUER_CANNOT_PAY` | The issuer of a charge cannot pay that same charge. |
| `AUTHORIZATION_FAILED` | The request could not be authorized. |
| `TOKEN_EXPIRED` | The authentication token has expired. |
| `TOKEN_INVALID` | The authentication token is malformed or invalid. |
| `TOKEN_NOT_ACTIVE` | The authentication token is not valid yet. |
| `REFRESH_TOKEN_MISSING` | A refresh token was not provided. |
| `PASSWORD_CONFIRMATION_MISMATCH` | The password confirmation does not match the password. |
| `WRONG_PASSWORD` | The provided password is incorrect. |
| `USER_NOT_FOUND` | The requested user could not be found. |
| `EMAIL_ALREADY_EXISTS` | The provided email address is already registered. |
