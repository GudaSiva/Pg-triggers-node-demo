/* Replace with your SQL commands */

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    NEW.created_at = NOW();
  ELSIF (TG_OP = 'DELETE') THEN
    NEW.deleted_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_task_timestamp
BEFORE INSERT OR DELETE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
