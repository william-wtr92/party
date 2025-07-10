-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_summary_event_id ON event_summary (id);