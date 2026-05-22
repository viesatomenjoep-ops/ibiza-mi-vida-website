interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  light?: boolean
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const titleColor = light ? 'text-soft-white' : 'text-midnight'
  const eyebrowColor = light ? 'text-teal-light' : 'text-teal'
  const subtitleColor = light ? 'text-soft-white/70' : 'text-midnight/60'

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <span className={`font-sans text-xs font-semibold uppercase tracking-widest ${eyebrowColor}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl ${titleColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-2xl font-sans text-base leading-relaxed md:text-lg ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
