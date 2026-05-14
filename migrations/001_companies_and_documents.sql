-- Migration: companies, memberships, agent_sessions, documents
-- Date: 2026-05-14
-- Description: Add multi-tenant company support, persisted Claude sessions, and a proper documents table

BEGIN;

-- ============================================================================
-- 1. COMPANIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS companies (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  siret        text,
  vat_number   text,
  address      text,
  phone        text,
  email        text,
  iban         text,
  logo_url     text,
  metadata     jsonb DEFAULT '{}'::jsonb,
  created_by   text REFERENCES users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);

-- ============================================================================
-- 2. COMPANY MEMBERS (many-to-many users <-> companies)
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_members (
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id   text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role         text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at    timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, company_id)
);

CREATE INDEX IF NOT EXISTS idx_company_members_company ON company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user ON company_members(user_id);

-- ============================================================================
-- 3. USER ACTIVE COMPANY (which company is currently selected by the user)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_active_company (
  user_id      text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_id   text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  updated_at   timestamptz DEFAULT now()
);

-- ============================================================================
-- 4. AGENT SESSIONS (persisted Claude --session-id mapping)
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_sessions (
  id                  text PRIMARY KEY,
  user_id             text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id          text REFERENCES companies(id) ON DELETE SET NULL,
  agent_id            text NOT NULL,
  conversation_id     text NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  claude_session_id   text NOT NULL,
  last_activity       timestamptz DEFAULT now(),
  expired             boolean DEFAULT false,
  created_at          timestamptz DEFAULT now(),
  UNIQUE (user_id, agent_id, conversation_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_sessions_user_agent ON agent_sessions(user_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_conv ON agent_sessions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_last_activity ON agent_sessions(last_activity);

-- ============================================================================
-- 5. EXTEND conversations with company_id
-- ============================================================================
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS company_id text REFERENCES companies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_company ON conversations(company_id);

-- ============================================================================
-- 6. DOCUMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id                text PRIMARY KEY,
  company_id        text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  conversation_id   text REFERENCES conversations(id) ON DELETE SET NULL,
  message_id        text REFERENCES messages(id) ON DELETE SET NULL,
  created_by        text REFERENCES users(id) ON DELETE SET NULL,
  agent_id          text,
  type              text NOT NULL,
  title             text,
  filename          text NOT NULL,
  format            text NOT NULL CHECK (format IN ('docx', 'xlsx', 'pptx', 'pdf')),
  mime_type         text NOT NULL,
  size_bytes        bigint NOT NULL DEFAULT 0,
  disk_path         text NOT NULL,
  preview_path      text,
  metadata          jsonb DEFAULT '{}'::jsonb,
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_company ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_conv ON documents(conversation_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_agent ON documents(agent_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- ============================================================================
-- 7. AUTOMATIC TIMESTAMP TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_companies_updated_at ON companies;
CREATE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
