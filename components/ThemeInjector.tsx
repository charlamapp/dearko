import { createClient } from "@supabase/supabase-js"

export type SiteTheme = {
  brandColor: string
  brandDark: string
  bgPage: string
  bgSection: string
  textPrimary: string
  textSecondary: string
}

export const DEFAULT_THEME: SiteTheme = {
  brandColor:    "#6C8145",
  brandDark:     "#57692F",
  bgPage:        "#FFFFFF",
  bgSection:     "#F8F6F3",
  textPrimary:   "#2C2B2B",
  textSecondary: "#6B6868",
}

async function getTheme(): Promise<SiteTheme> {
  try {
    const { data } = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
      .from("site_content")
      .select("data")
      .eq("id", "theme")
      .single()
    if (data?.data) return { ...DEFAULT_THEME, ...data.data }
  } catch {}
  return DEFAULT_THEME
}

export default async function ThemeInjector() {
  const t = await getTheme()
  const css = `
:root {
  --brand: ${t.brandColor};
  --brand-dark: ${t.brandDark};
  --bg-page: ${t.bgPage};
  --bg-section: ${t.bgSection};
  --text-primary: ${t.textPrimary};
  --text-secondary: ${t.textSecondary};
}`.trim()

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
