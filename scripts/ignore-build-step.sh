#!/bin/bash
# Vercel Ignored Build Step
#
# Return code 1 = Vercel gaat WEL bouwen.
# Return code 0 = Vercel SLAAT de build OVER (verbruikt 0 build-minuten).

echo "🔍 Vercel build-controle gestart..."

# 1. Schakel preview deployments uit: alleen bouwen op productie (master branch)
if [ "$VERCEL_ENV" != "production" ]; then
  echo "🛑 Preview deployment overgeslagen op branch '$VERCEL_GIT_COMMIT_REF' (bespaart Vercel build-minuten)."
  exit 0
fi

# 2. Bepaal commit range (Vercel levert CACHED_COMMIT_REF van de vorige deployment)
COMMIT_RANGE="HEAD^ HEAD"
if [ -n "$CACHED_COMMIT_REF" ]; then
  COMMIT_RANGE="$CACHED_COMMIT_REF HEAD"
fi

# Controleer of er daadwerkelijk applicatiecode of assets zijn gewijzigd
# Als alleen documentatie, markdown of git-config is gewijzigd, sla de build over
if git diff $COMMIT_RANGE --quiet -- src/ public/ package.json package-lock.json next.config.mjs tailwind.config.ts postcss.config.mjs tsconfig.json; then
  echo "🛑 Geen wijzigingen in applicatiecode of configuratie ($COMMIT_RANGE). Build overgeslagen."
  exit 0
fi

echo "✅ Relevante codewijzigingen gedetecteerd. Productie-build wordt gestart."
exit 1
