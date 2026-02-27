-- CreateTable
CREATE TABLE `revoked_tokens` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `token` TEXT NOT NULL,
    `revoked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
