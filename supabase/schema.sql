-- Supabase Database Schema for Interactive Campaign Platform

-- 1. Campaigns Table
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'ended', 'draft')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Options Table (e.g. Apple, Android)
CREATE TABLE public.options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    model_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Votes Table
CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Browser fingerprint or session ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(campaign_id, user_id) -- One vote per user per campaign
);

-- 4. Create indexes for performance
CREATE INDEX idx_votes_campaign ON public.votes(campaign_id);
CREATE INDEX idx_votes_option ON public.votes(option_id);

-- 5. Realtime Setup
-- Enable realtime for the votes table to broadcast inserts
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;

-- Insert initial dummy data for Apple vs Android
INSERT INTO public.campaigns (id, slug, title, status)
VALUES ('11111111-1111-1111-1111-111111111111', 'apple-vs-android', 'Apple vs Android', 'active');

INSERT INTO public.options (id, campaign_id, name, color)
VALUES 
    ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Apple', '#ffffff'),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Android', '#3DDC84');
