#!/usr/bin/env bash
# Downloads images from the original adapti.wordpress.com posts into assets/images/.
# Run once from the repository root: bash scripts/download-wp-images.sh

set -euo pipefail
cd "$(dirname "$0")/.."

download() {
  local url="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  if [ -f "$dest" ]; then
    echo "  already exists: $dest"
  else
    echo "  downloading $url -> $dest"
    curl -fsSL "$url" -o "$dest"
  fi
}

echo "==> Post: perguntas-para-entrevista-de-seniores"
download \
  "https://adapti.wordpress.com/wp-content/uploads/2012/09/entrevista-de-emprego-01.jpg" \
  "assets/images/perguntas-para-entrevista-de-seniores/entrevista-de-emprego-01.jpg"

echo "==> Post: recuperando-dados-da-sessao-nos-eventos-do-globalasax"
download \
  "https://adapti.wordpress.com/wp-content/uploads/2012/10/image_thumb1.png" \
  "assets/images/recuperando-dados-da-sessao-nos-eventos-do-globalasax/image_thumb1.png"

echo "==> Post: tfs-command-line-removendo-team-project"
download \
  "https://adapti.wordpress.com/wp-content/uploads/2013/05/informacoes.png" \
  "assets/images/tfs-command-line-removendo-team-project/informacoes.png"
download \
  "https://adapti.wordpress.com/wp-content/uploads/2013/05/comando1.png" \
  "assets/images/tfs-command-line-removendo-team-project/comando1.png"

echo "==> Post: tfs-command-line-destruindo-elementos"
download \
  "https://adapti.wordpress.com/wp-content/uploads/2013/05/destroy.png" \
  "assets/images/tfs-command-line-destruindo-elementos/destroy.png"
download \
  "https://adapti.wordpress.com/wp-content/uploads/2013/05/info.png" \
  "assets/images/tfs-command-line-destruindo-elementos/info.png"

echo ""
echo "Done! All images downloaded to assets/images/."
