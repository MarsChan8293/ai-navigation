-- CreateTable
CREATE TABLE "use_cases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_base64" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "website_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "use_cases_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "use_cases_website_id_idx" ON "use_cases"("website_id");

-- CreateIndex
CREATE INDEX "use_cases_status_idx" ON "use_cases"("status");
