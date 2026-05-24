import { createServerClient } from '@/lib/supabase/server'

interface PageContentDefaults {
  title: string
  subtitle: string
  backgroundImage: string
}

export async function getPageContent(pageName: string, defaults: PageContentDefaults) {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('page_contents')
      .select('*')
      .eq('page_name', pageName)
      .single()
      
    if (data) {
      return {
        title: data.hero_title || defaults.title,
        subtitle: data.hero_sub || defaults.subtitle,
        backgroundImage: data.hero_img || defaults.backgroundImage,
        description: data.description,
        ctaText: data.cta_text
      }
    }
  } catch {
    // fall through to defaults
  }
  return defaults
}
