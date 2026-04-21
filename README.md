# Splatoon Website

This is a replacement service for SplatNet, the Splatoon 1 service for showing stage rotations, active matches, and profile states from matches.

## Setup

Create a .env with the following values:

| Key                                      | Description                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| PN_SPLATOON_WEBSITE_BOSS_AES_KEY         | BOSS AES key, decoded not hex                                                              |
| PN_SPLATOON_WEBSITE_BOSS_HMAC_KEY        | BOSS HMAC key, decoded not hex                                                             |
| PN_SPLATOON_WEBSITE_BOSS_DOMAIN          | Domain where the BOSS server exists. E.g., `https://npts.app.pretendo.cc`                  |
| PN_SPLATOON_WEBSITE_BOSS_APP_ID          | BOSS App ID. Should be `rjVlM7hUXPxmYQJh` for Splatoon                                     |
| PN_SPLATOON_WEBSITE_MAX_RESPONSE         | Number of hours of to show stages for                                                      |
| PN_SPLATOON_WEBSITE_FILE_CACHE_DIR       | Directory where cached VSSetting files are stored.                                         |
| PN_SPLATOON_WEBSITE_POSTGRES_URI         | Splatoon postgres uri e.g., `postgres://user:password@host:post/database?sslmode=disabled` |
| PN_SPLATOON_WEBSITE_GRPC_ACCOUNT_API_KEY | API Key to connect to the account grpc server                                              |
| PN_SPLATOON_WEBSITE_GRPC_ACCOUNT_PORT    | Port to connect to the account grpc server                                                 |
| PN_SPLATOON_WEBSITE_GRPC_ACCOUNT_HOST    | Host to connect to the account grpc server                                                 |

## Running locally for development

### Prerequisites:

- Clone the repository
- Have NodeJS 20 or higher installed

### Steps

1. Enter the above configs into the `.env` file
2. Run the following commands:

	```
	npm i
	npm run dev
	```

3. That's it!
