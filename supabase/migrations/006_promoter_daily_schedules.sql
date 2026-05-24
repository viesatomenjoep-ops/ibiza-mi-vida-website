-- Create a daily schedule configuration table
CREATE TABLE IF NOT EXISTS public.daily_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_date DATE UNIQUE NOT NULL,
    active_categories JSONB DEFAULT '[]'::jsonb, -- Array of category strings (e.g., ["club-ticket", "boat-party"])
    hero_title_en TEXT,
    hero_title_nl TEXT,
    hero_title_es TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.daily_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on published schedules" 
    ON public.daily_schedules FOR SELECT 
    USING (is_published = true);

CREATE POLICY "Allow authenticated users full access to schedules" 
    ON public.daily_schedules FOR ALL 
    USING (auth.role() = 'authenticated');

-- Link promoter deals strictly to a daily schedule
ALTER TABLE public.promoter_deals 
ADD COLUMN IF NOT EXISTS schedule_id UUID REFERENCES public.daily_schedules(id) ON DELETE CASCADE;
