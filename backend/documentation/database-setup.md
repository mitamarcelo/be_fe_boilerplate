# Database Setup (MySQL)

This guide sets up a local MySQL database for this backend and documents
the environment variables required to run the API and Prisma migrations.

## 1) Verify MySQL is running

```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

## 2) Create database and user

Open a MySQL shell:

```bash
mysql -u root -p
```

Create a database and user (replace values as needed):

```sql
CREATE DATABASE {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE prisma_shadow_{DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY '{DB_PASSWORD}';
GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{APP_NAME}_user'@'localhost';
GRANT ALL PRIVILEGES ON prisma_shadow_{DB_NAME}.* TO '{APP_NAME}_user'@'localhost';
FLUSH PRIVILEGES;
```

## 3) Run Prisma and start the API

From `backend/`:

```bash
npm run prisma:generate
npm run prisma:migrate
```
