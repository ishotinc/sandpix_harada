-- Add language to projects (purpose already exists)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'ja' CHECK (language IN ('ja', 'en'));

-- Add index for filtering
CREATE INDEX IF NOT EXISTS idx_projects_purpose ON projects(purpose);
CREATE INDEX IF NOT EXISTS idx_projects_language ON projects(language);