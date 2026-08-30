# Icon sources

Master: `icon.svg` (deep-green tile + cream oil-droplet & two-leaf sprig, #3B5D4E / #F7F4EE).
`../public/favicon.svg` is a simplified 2-colour version (droplet only, no sprig — reads at 16px).

Regenerate the PNGs in `../public/` after editing:

```bash
cd public
npx --yes sharp-cli -i icon.svg                 -o pwa-192.png          resize 192 192
npx --yes sharp-cli -i icon.svg                 -o pwa-512.png          resize 512 512
npx --yes sharp-cli -i ../assets/icons/maskable.svg    -o pwa-maskable-512.png resize 512 512
npx --yes sharp-cli -i ../assets/icons/apple-touch.svg -o apple-touch-icon.png resize 180 180
```

`maskable.svg` is full-bleed (no rounded corners) with the mark scaled to ~66% so it
survives Android's adaptive-icon crop. `apple-touch.svg` is full-bleed at full mark size
(iOS applies its own rounding).
