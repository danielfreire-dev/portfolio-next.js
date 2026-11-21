# Font sources

Original font files used to generate the WOFF2 subsets in `../subset/`, which are
what the site actually loads (see `src/app/[locale]/layout.tsx`). Nothing here is
shipped to the browser. Licenses: `../subset/OFL-*.txt` (SIL Open Font License 1.1).

| Source | Subset | Notes |
| --- | --- | --- |
| `MozillaHeadline-VariableFont_wdth,wght.ttf` | `MozillaHeadline-500-latin.woff2` | Logo. Pinned to weight 500, width 100. |
| `IBMPlexSerif-Regular.ttf` | `IBMPlexSerif-Regular-latin.woff2` | Headings. |
| `IBMPlexSerif-Bold.ttf` | — | Not used yet. Needed for real (non-synthesized) bold headings. |
| `IBMPlexSansVar-Roman.woff2` | `IBMPlexSansVar-Roman-latin.woff2` | Body text. Width axis pinned, weights 100–700 kept. |
| `IBMPlexSansVar-Italic.woff2` | `IBMPlexSansVar-Italic-latin.woff2` | Footer links. Width axis pinned. |

## Regenerating a subset

The character range covers Latin + Latin Extended-A (all six site languages) and
common punctuation. Extend `U` if a new language needs more characters.

```sh
U="U+0000-00FF,U+0100-017F,U+0218-021B,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD"
pyftsubset IBMPlexSerif-Regular.ttf --unicodes="$U" --flavor=woff2 --layout-features='*' \
  --output-file=../subset/IBMPlexSerif-Regular-latin.woff2
```

Pinning variation axes (variable fonts only), after subsetting:

```sh
python3 -c "
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
f = TTFont('../subset/IBMPlexSansVar-Roman-latin.woff2')
out = instancer.instantiateVariableFont(f, {'wdth': None})  # drop width axis, keep weight
out.flavor = 'woff2'; out.save('../subset/IBMPlexSansVar-Roman-latin.woff2')
"
```

For the logo font use `{'wght': 500, 'wdth': None}` to produce a static weight-500 face.
