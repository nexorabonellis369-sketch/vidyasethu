-- InsForge (PostgreSQL) Schema for Vidyasetu

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  roll TEXT,
  dept TEXT DEFAULT 'Applied Science',
  avatar TEXT DEFAULT '👨‍🎓',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bookmarks Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  topic TEXT NOT NULL,
  unit_num INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Saved Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_code TEXT,
  topic TEXT NOT NULL,
  content TEXT, -- Markdown or JSON content
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Doubts Table
CREATE TABLE IF NOT EXISTS public.doubts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  status TEXT DEFAULT 'solved', -- 'pending', 'solved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
