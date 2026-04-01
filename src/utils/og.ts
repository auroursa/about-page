import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

let cjkBoldCache: ArrayBuffer | null = null;
let cjkRegularCache: ArrayBuffer | null = null;
let overpassFontCache: ArrayBuffer | null = null;
let avatarDataUri: string | null = null;

async function loadCjkBold(): Promise<ArrayBuffer> {
  if (cjkBoldCache) return cjkBoldCache;
  const res = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-700-normal.woff'
  );
  cjkBoldCache = await res.arrayBuffer();
  return cjkBoldCache;
}

async function loadCjkRegular(): Promise<ArrayBuffer> {
  if (cjkRegularCache) return cjkRegularCache;
  const res = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-400-normal.woff'
  );
  cjkRegularCache = await res.arrayBuffer();
  return cjkRegularCache;
}

async function loadOverpassFont(): Promise<ArrayBuffer> {
  if (overpassFontCache) return overpassFontCache;
  const buf = await readFile(join(process.cwd(), 'src/assets/fonts/Overpass-Bold.ttf'));
  overpassFontCache = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return overpassFontCache;
}

async function loadAvatar(): Promise<string> {
  if (avatarDataUri) return avatarDataUri;
  const raw = await readFile(join(process.cwd(), 'public/img/avatar.webp'));
  const png = await sharp(raw).png().toBuffer();
  avatarDataUri = `data:image/png;base64,${png.toString('base64')}`;
  return avatarDataUri;
}

export async function generateOgImage(title: string, subtitle?: string, description?: string): Promise<Buffer> {
  const cjkBold = await loadCjkBold();
  const cjkRegular = await loadCjkRegular();
  const overpassFont = await loadOverpassFont();
  const avatar = await loadAvatar();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 72px',
          background: 'linear-gradient(135deg, #ebf4f4 0%, #d8e3e7 100%)',
          fontFamily: 'Noto Sans SC',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              },
              children: [
                subtitle
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '28px',
                          color: '#11659a',
                          letterSpacing: '0.12em',
                          fontWeight: 700,
                        },
                        children: subtitle,
                      },
                    }
                  : null,
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 20 ? '56px' : '64px',
                      fontWeight: 700,
                      color: '#322c28',
                      lineHeight: 1.3,
                      letterSpacing: '0.02em',
                    },
                    children: title,
                  },
                },
                description
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '26px',
                          fontWeight: 400,
                          color: 'rgba(50, 44, 40, 0.6)',
                          lineHeight: 1.6,
                          marginTop: '4px',
                        },
                        children: description,
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '52px',
                left: '72px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: avatar,
                    width: 48,
                    height: 48,
                    style: {
                      borderRadius: '50%',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '28px',
                      color: '#11659a',
                      fontFamily: 'Overpass',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                    },
                    children: 'Cynosura',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans SC',
          data: cjkBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Noto Sans SC',
          data: cjkRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Overpass',
          data: overpassFont,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
