-- ════════════════════════════════════════════════════════════
-- IT Ninja — Supabase Database Schema
-- Run this in your Supabase SQL Editor after creating a project
-- ════════════════════════════════════════════════════════════

-- 1. User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username    TEXT UNIQUE,
  avatar_url  TEXT,
  level       TEXT DEFAULT 'beginner',
  goal        TEXT DEFAULT 'sysadmin',
  total_xp    INTEGER DEFAULT 0,
  rank        TEXT DEFAULT 'Ninja Rookie',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Roadmap Progress per user
CREATE TABLE IF NOT EXISTS public.user_progress (
  id           SERIAL PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id      TEXT NOT NULL,
  completed    BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, item_id)
);

-- 3. Achievements & Badges
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id             SERIAL PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  xp_earned      INTEGER DEFAULT 0,
  earned_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- 4. Custom Roadmap Planner data
CREATE TABLE IF NOT EXISTS public.user_roadmap (
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  level         TEXT,
  goal          TEXT,
  task_progress JSONB DEFAULT '{}',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════
-- Row Level Security (RLS) — Users can only read/write their own data
-- ════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roadmap ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read (for leaderboard), only owner can write
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Progress: only owner
CREATE POLICY "Users can manage their own progress"
  ON public.user_progress USING (auth.uid() = user_id);

-- Achievements: only owner
CREATE POLICY "Users can manage their own achievements"
  ON public.user_achievements USING (auth.uid() = user_id);

-- Roadmap: only owner
CREATE POLICY "Users can manage their own roadmap"
  ON public.user_roadmap USING (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════
-- Auto-create profile on user signup
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, total_xp, rank)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    0,
    'Ninja Rookie'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ════════════════════════════════════════════════════════════
-- Real-time: enable for leaderboard live updates
-- ════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
