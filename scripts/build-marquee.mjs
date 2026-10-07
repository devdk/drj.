/* ==========================================================================
   BUILD THE WEBSITE-MARQUEE TILES

     node scripts/build-marquee.mjs

   Input:  captures/raw/<slug>-desktop.png and -mobile.png
           (from scripts/capture-live.mjs — real pages at real URLs)
   Output: public/shots/marquee/<slug>-desktop.{avif,webp}
           public/shots/marquee/<slug>-mobile.{avif,webp}

   Two tiles per site, so seven sites make fourteen different pictures and
   the marquee does not show the same frame twice in a row:

     DESKTOP  the first screen of the live site, cropped to the tile.
     MOBILE   the phone capture, standing in the middle of the tile on a
              blurred, darkened enlargement of itself. Nothing is drawn that
              the site does not contain — the backdrop IS the screenshot.

   Re-run after re-capturing; the section reads the files by convention.
   ========================================================================== */

import sharp from 'sharp'
import { existsSync, mkdirSync } from 'node:fs'

const RAW = 'captures/raw'
const OUT = 'public/shots/marquee'

/* The websites and stores — every Shopify and WordPress project with a
   capture. Keep in step with WEBSITE_SLUGS in WebsitesMarquee.tsx. */
const SLUGS = [
  'zyvren',
  'allure-dental',
  'women-wellness-first',
  'mariforce',
  'chefs-and-homes',
  'swann-bookkeeping',
  'mirasphere-site',
]

/* The tile is the original component's 970:700, at the size it is shown on
   a 2x screen — the marquee scales columns down to ~400px wide. */
const W = 800
const H = Math.round((W * 700) / 970)

mkdirSync(OUT, { recursive: true })

async function write(pipeline, base) {
  const buf = await pipeline.png().toBuffer()
  await sharp(buf).avif({ quality: 52, effort: 6 }).toFile(`${base}.avif`)
  await sharp(buf).webp({ quality: 74 }).toFile(`${base}.webp`)
}

function roundedMask(w, h, r) {
  return Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`,
  )
}

for (const slug of SLUGS) {
  const desktop = `${RAW}/${slug}-desktop.png`
  const mobile = `${RAW}/${slug}-mobile.png`

  if (existsSync(desktop)) {
    await write(sharp(desktop).resize(W, H, { fit: 'cover', position: 'top' }), `${OUT}/${slug}-desktop`)
    console.log(`✓ ${slug}-desktop`)
  } else {
    console.log(`– ${slug}: no desktop capture`)
  }

  if (existsSync(mobile)) {
    const backdrop = await sharp(mobile)
      .resize(W, H, { fit: 'cover', position: 'top' })
      .blur(28)
      .modulate({ brightness: 0.45, saturation: 1.1 })
      .png()
      .toBuffer()

    /* The phone, at 86% of the tile's height, keeping the top of the page —
       that is the part the capture is of. */
    const phoneH = Math.round(H * 0.86)
    const source = await sharp(mobile).metadata()
    const shot = await sharp(mobile)
      .resize({ width: Math.round((phoneH * source.width) / source.height), height: phoneH })
      .png()
      .toBuffer()
    const sm = await sharp(shot).metadata()
    const rounded = await sharp(shot)
      .composite([{ input: roundedMask(sm.width, sm.height, 18), blend: 'dest-in' }])
      .png()
      .toBuffer()

    await write(
      sharp(backdrop).composite([
        {
          input: rounded,
          left: Math.round((W - sm.width) / 2),
          top: Math.round((H - sm.height) / 2),
        },
      ]),
      `${OUT}/${slug}-mobile`,
    )
    console.log(`✓ ${slug}-mobile`)
  } else {
    console.log(`– ${slug}: no mobile capture`)
  }
}
