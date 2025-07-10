-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_summary_id ON reviews_summary (review_id);