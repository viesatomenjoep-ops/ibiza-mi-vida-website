-- Create table for daily and weekly deals managed by the Promoter
CREATE TABLE IF NOT EXISTS public.promoter_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_type TEXT NOT NULL CHECK (deal_type IN ('daily', 'weekly')),
    target_date DATE NOT NULL,
    end_date DATE, -- For weekly deals
    title_en TEXT NOT NULL,
    title_nl TEXT NOT NULL,
    title_es TEXT NOT NULL,
    description_en TEXT,
    description_nl TEXT,
    description_es TEXT,
    price DECIMAL(10, 2),
    image_url TEXT,
    pdf_url TEXT,
    category TEXT, -- e.g., 'club-ticket', 'boat-party'
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.promoter_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on published deals" 
    ON public.promoter_deals FOR SELECT 
    USING (is_published = true);

CREATE POLICY "Allow authenticated users full access to deals" 
    ON public.promoter_deals FOR ALL 
    USING (auth.role() = 'authenticated');
