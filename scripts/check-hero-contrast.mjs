#!/usr/bin/env node
// Prove the hero copy stays legible over EVERY frame of the looping video — and that the MARK
// survives the scrim.
//
//   npm run check:hero-contrast
//
// Needs python3 with numpy + Pillow, and the ffmpeg that ships inside the `imageio-ffmpeg`
// wheel (no system ffmpeg required). Both are what the repo already uses for asset work.
//
// ⚠️ WHY THIS EXISTS, AND WHY IT HAS TWO OPPOSING GATES.
//
// The first version of this check sampled the brightest pixel in a band across the frame rather
// than the pixels the words actually occupy. It found a bright arc in empty space, pushed a FLAT
// scrim to 0.76, and that flat 0.76 rendered the mark's white chrome as slate and its #00E5FF
// eyes as dull teal. A gate that passes a hero with an invisible logo is not a gate. So:
//
//   1. THE COPY, measured at the REAL text boxes read off the live DOM (listed below).
//   2. THE MARK, with a floor UNDER how dark its body and eyes may go.
//
// Gate 1 alone is always winnable by painting everything black. Gate 2 is what stops that.
//
// It also prints the MIDPOINT frame separately. The clip pings-pongs, so the midpoint is the
// moment the mark is largest and has drifted furthest left — nearest the copy, and the frame
// most likely to break the subhead. It is usually, but not necessarily, the worst case, so it
// is reported whether or not it wins.
import { execFileSync } from 'node:child_process'

// ⚠️ `stops` MIRRORS .rl-hero-scrim IN globals.css BY HAND. Change one, change the other.
// `axis: 'x'` = `linear-gradient(to right, …)`; `axis: 'y'` = `linear-gradient(180deg, …)`.
//
// `boxes` are Range.getClientRects() unions off the live DOM at that viewport — the pixels the
// glyphs occupy, not a guess at where the copy roughly sits. Move the copy, re-read them: a box
// that no longer covers the text measures nothing and passes for free.
//
// ⚠️ THEY ARE HERO-RELATIVE, NOT VIEWPORT-RELATIVE, AND THE DIFFERENCE IS 65 PIXELS. The video
// and the scrim are `inset: 0` inside `.rl-hero`, which starts BELOW the sticky header. Measured
// in viewport coordinates this check passed the mobile headline at 19:1 while the ring was
// visibly crossing it in a screenshot. Subtract the hero's own top offset when you re-read them.
//
// `vh` is the HERO's height, min(88vh, 780px), not the viewport's — the video and the scrim are
// both inset:0 in that box, so that is the box the gradient's percentages run across.
const SETS = {
  desktop: {
    file: 'public/hero.mp4', vw: 1280, vh: 704, axis: 'x',
    stops: [[0, 0.88], [0.36, 0.84], [0.477, 0.74], [0.586, 0.07], [1, 0.04]],
    boxes: {
      eyebrow: [152, 112, 72, 17],
      headline: [152, 139, 459, 204],
      subhead: [152, 364, 447, 138],
      'cta pill': [152, 543, 167, 50],
      'cta quiet': [331, 543, 149, 50],
    },
    markFloor: { bodyY: 150, eyeG: 170 },
  },
  // ⚠️ MOBILE MEASURES A REQUIRED ALPHA OF 0.00 EVERYWHERE UNDER THE COPY, because the portrait
  // file seats the mark ABOVE the copy — y 15..130 in a 715px hero, with the eyebrow starting at
  // 118 and clearing it horizontally — and the ground below it is the clip's own pure black. The scrim here is therefore INSURANCE, not a fix: it stays near-clear over the mark
  // and rises to 0.55 under the copy, where 0.55 over black is indistinguishable from black. It
  // costs the mark nothing and it means a re-crop that moves the mark down does not silently
  // ship unreadable copy. Same floors as desktop — there is no reason to accept less here.
  mobile: {
    file: 'public/hero-portrait.mp4', vw: 375, vh: 715, axis: 'y',
    stops: [[0, 0.04], [0.19, 0.06], [0.26, 0.55], [1, 0.6]],
    boxes: {
      eyebrow: [24, 118, 72, 17],
      headline: [24, 147, 318, 141],
      subhead: [24, 307, 326, 150],
      'cta pill': [24, 488, 167, 48],
      'cta quiet': [24, 548, 149, 50],
    },
    markFloor: { bodyY: 150, eyeG: 170 },
  },
}

const FG = [245, 248, 252]      // --foreground
const MUTED = [179, 194, 211]   // --muted
const ACCENT = [122, 223, 255]  // --accent
const SCRIM = [7, 11, 17]
// The primary CTA is an OPAQUE cyan pill: its LABEL's contrast is fixed by the pill and the scrim
// cannot touch it. What the scrim can still break is the pill's edge against the ground — a UI
// component boundary, 3:1 under WCAG 1.4.11 — so that is what is measured there.
const NEED = {
  eyebrow: [ACCENT, 4.5, 'accent #7adfff (small)'],
  headline: [FG, 3.0, 'text   #f5f8fc (large)'],
  subhead: [MUTED, 4.5, 'muted  #b3c2d3 (body) '],
  'cta pill': [ACCENT, 3.0, 'pill   #7adfff (edge) '],
  'cta quiet': [FG, 4.5, 'text   #f5f8fc (body) '],
}

const alphaAt = (x, y, set) => {
  const f = set.axis === 'x' ? x / set.vw : y / set.vh
  const s = set.stops
  if (f <= s[0][0]) return s[0][1]
  for (let i = 0; i < s.length - 1; i++) {
    const [p0, a0] = s[i], [p1, a1] = s[i + 1]
    if (f <= p1) return a0 + (a1 - a0) * (f - p0) / (p1 - p0)
  }
  return s[s.length - 1][1]
}
const alphaAtFrac = (f, set) => alphaAt(f * set.vw, f * set.vh, set)
const over = (px, a) => SCRIM.map((s, i) => a * s + (1 - a) * px[i])
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const L = p => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2])
const luma = p => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]
const ratio = (a, b) => { const x = L(a), y = L(b), hi = Math.max(x, y), lo = Math.min(x, y); return (hi + 0.05) / (lo + 0.05) }
const hex = p => '#' + p.map(v => Math.round(v).toString(16).padStart(2, '0')).join('')

// Python decodes the video straight to raw RGB through the bundled ffmpeg — no temp PNGs — and
// never sees the scrim. It returns the brightest source pixel any frame puts at each sample
// point, plus the mark's own pixels bucketed along the gradient's axis, so re-tuning the
// gradient is a JS edit rather than another decode.
const py = `
import json, subprocess, itertools
import numpy as np
import imageio_ffmpeg
SETS=${JSON.stringify(SETS)}
NB=48
FF=imageio_ffmpeg.get_ffmpeg_exe()

def frames(path):
    p=subprocess.run([FF,'-v','error','-i',path,'-f','rawvideo','-pix_fmt','rgb24','-'],
                     capture_output=True)
    meta=subprocess.run([FF,'-v','error','-i',path,'-f','null','-'],capture_output=True)
    return p.stdout

def dims(path):
    out=subprocess.run([FF,'-hide_banner','-i',path],capture_output=True,text=True).stderr
    for tok in out.split():
        if 'x' in tok and tok.replace(',','').replace('x','').isdigit():
            w,h=tok.replace(',','').split('x')
            if int(w)>100: return int(w),int(h)
    raise SystemExit('cannot read dimensions of '+path)

def find_eyes(a,bs=4):
    """The two eyes, as (x, y, mean rgb) — or None when the mark is not resolvable yet.

    ⚠️ THREE THINGS HERE ARE LOAD-BEARING, each of which produced a wrong number first.
      * The cyan mask is restricted to the HEAD — strict near-white, trimmed to its 10th-90th
        percentile. Sparkles and the ring's rim also pass a cyan test, and a plain bbox is wide
        enough to include them: with one, frame 35 reported an "eye" at scrim 0.74, which was
        the ring crossing the copy column.
      * Candidates are separated in BLOCK indices, not pixel coordinates. Mixing the two let two
        blocks of the SAME blob be returned as "two eyes", 8px apart.
      * The pair is chosen by being LEVEL, not by being brightest. The head is drawn with a
        slight tilt, so the tolerance is 5 blocks, not 0.
    bs=4 because the portrait file letterboxes the clip to 45%: an eye is ~25px there, and
    larger blocks never fill.
    """
    r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
    mn=a.min(2); mx=a.max(2)
    ys,xs=np.nonzero((mn>200)&((mx-mn)<25))
    if len(xs)<500: return None
    x0,x1=np.percentile(xs,[10,90]); y0,y1=np.percentile(ys,[10,90])
    inside=np.zeros(a.shape[:2],bool); inside[int(y0):int(y1)+1,int(x0):int(x1)+1]=True
    m=(b>200)&(g>190)&(r<110)&inside
    h,w=m.shape; H,W=h//bs,w//bs
    gg=m[:H*bs,:W*bs].reshape(H,bs,W,bs).sum((1,3))
    cand=[]
    for idx in gg.ravel().argsort()[::-1]:
        gy,gx=divmod(int(idx),W)
        if gg[gy,gx] < 0.8*bs*bs: break
        if any(abs(gx-p[0])<8 and abs(gy-p[1])<8 for p in cand): continue
        cand.append((gx,gy))
        if len(cand)==8: break
    best=None
    for p,q in itertools.combinations(cand,2):
        dy=abs(p[1]-q[1]); dx=abs(p[0]-q[0])
        if dx<8 or dy>5: continue
        if best is None or dy<best[0]: best=(dy,p,q)
    if best is None: return None
    yy,xx=np.ogrid[:h,:w]; out=[]
    for gx,gy in best[1:]:
        ex,ey=gx*bs+bs//2, gy*bs+bs//2
        near=m&(((xx-ex)**2+(yy-ey)**2)<=(4*bs)**2)
        out.append((ex,ey,a[near].mean(0)))
    return out

out={}
for name,c in SETS.items():
    iw,ih=dims(c['file'])
    buf=frames(c['file'])
    n=len(buf)//(iw*ih*3)
    vid=np.frombuffer(buf,dtype=np.uint8)[:n*iw*ih*3].reshape(n,ih,iw,3)
    sc=max(c['vw']/iw,c['vh']/ih); ox,oy=(c['vw']-iw*sc)/2,(c['vh']-ih*sc)/2
    ax=c['axis']
    grids={}
    for key,(bx,by,bw,bh) in c['boxes'].items():
        vx=np.arange(bx,bx+bw,3); vy=np.arange(by,by+bh,3)
        fx=((vx-ox)/sc).astype(int); fy=((vy-oy)/sc).astype(int)
        kx=(fx>=0)&(fx<iw); ky=(fy>=0)&(fy<ih)
        grids[key]=(vx[kx],vy[ky],fx[kx],fy[ky])
    best={k:None for k in grids}; bestf={k:None for k in grids}
    marks=[]
    for i in range(n):
        a=vid[i].astype(float)
        for key,(vx,vy,fx,fy) in grids.items():
            p=a[np.ix_(fy,fx)]
            l=0.2126*p[:,:,0]+0.7152*p[:,:,1]+0.0722*p[:,:,2]
            if best[key] is None:
                best[key]=p; bestf[key]=np.full(l.shape,i+1)
            else:
                cur=best[key]
                m=l>(0.2126*cur[:,:,0]+0.7152*cur[:,:,1]+0.0722*cur[:,:,2])
                best[key]=np.where(m[:,:,None],p,cur); bestf[key]=np.where(m,i+1,bestf[key])
        r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
        mn=a.min(2); mx=a.max(2)
        found=find_eyes(a)
        if found is None: continue
        def frac(fxs,fys):
            return ((np.asarray(fxs)*sc+ox)/c['vw']) if ax=='x' else ((np.asarray(fys)*sc+oy)/c['vh'])
        eyeout=[{'f':float(frac(ex,ey)),'px':[float(v) for v in px]} for ex,ey,px in found]
        # THE BODY IS THE WHOLE CHROME MASS, bucketed along the axis and averaged AS RENDERED —
        # not one hot highlight. The mark's leading edge is MEANT to fall off into the copy's
        # shadow; judging the body by that single pixel would fail a hero that reads perfectly.
        body=(mn>170)&((mx-mn)<30)
        ys,xs=np.nonzero(body)
        if len(xs)<500: continue
        idx=np.clip((frac(xs,ys)*NB).astype(int),0,NB-1)
        px=a[ys,xs]
        cnt=np.bincount(idx,minlength=NB)
        sums=np.stack([np.bincount(idx,weights=px[:,k],minlength=NB) for k in range(3)],1)
        marks.append({'frame':i+1,'eyes':eyeout,
                      'body':[[float((k+0.5)/NB),[float(v) for v in sums[k]/cnt[k]],int(cnt[k])]
                              for k in range(NB) if cnt[k]>0]})
    # the midpoint frame on its own — the mark at its largest and furthest left
    mid=n//2
    a=vid[mid].astype(float)
    midbox={}
    for key,(vx,vy,fx,fy) in grids.items():
        midbox[key]={'vx':vx.tolist(),'vy':vy.tolist(),'px':a[np.ix_(fy,fx)].tolist()}
    out[name]={'n':int(n),'mid':int(mid)+1,
               'boxes':{k:{'vx':grids[k][0].tolist(),'vy':grids[k][1].tolist(),
                           'px':best[k].tolist(),'frame':bestf[k].tolist()} for k in grids},
               'midboxes':midbox,'marks':marks}
print(json.dumps(out))
`

const raw = JSON.parse(execFileSync('python3', ['-c', py], { encoding: 'utf8', maxBuffer: 1 << 29 }))

const worstIn = (b, colour, set) => {
  let w = { r: Infinity }
  for (let j = 0; j < b.vy.length; j++)
    for (let i = 0; i < b.vx.length; i++) {
      const a = alphaAt(b.vx[i], b.vy[j], set)
      const r = ratio(colour, over(b.px[j][i], a))
      if (r < w.r) w = { r, a, x: b.vx[i], y: b.vy[j], frame: b.frame ? b.frame[j][i] : null }
    }
  return w
}

let fail = 0
for (const name of ['desktop', 'mobile']) {
  const set = SETS[name], d = raw[name]
  console.log(`\n${name} — hero box ${set.vw}x${set.vh}, ${d.n} frames, scrim ${set.axis === 'x' ? 'HORIZONTAL (dark left)' : 'VERTICAL (dark below the mark)'}`)
  console.log('  the copy, worst case over every frame:')
  for (const [key, [colour, need, label]] of Object.entries(NEED)) {
    const w = worstIn(d.boxes[key], colour, set)
    const ok = w.r >= need
    if (!ok) fail = 1
    console.log(`    ${ok ? 'ok ' : '❌ '} ${key.padEnd(9)} ${label}  ${w.r.toFixed(2)}:1 (needs ${need.toFixed(1)}) — frame ${w.frame} at ${w.x},${w.y}, scrim ${w.a.toFixed(2)}`)
  }
  console.log(`  the copy, at the MIDPOINT frame ${d.mid} — mark largest and furthest left:`)
  for (const [key, [colour, need, label]] of Object.entries(NEED)) {
    const w = worstIn(d.midboxes[key], colour, set)
    const ok = w.r >= need
    if (!ok) fail = 1
    console.log(`    ${ok ? 'ok ' : '❌ '} ${key.padEnd(9)} ${label}  ${w.r.toFixed(2)}:1 (needs ${need.toFixed(1)}) — at ${w.x},${w.y}, scrim ${w.a.toFixed(2)}`)
  }

  const marks = d.marks
  if (!marks.length) { console.log('    ❌ the mark was never found in any frame'); fail = 1; continue }
  let wb = { y: Infinity }, we = { g: Infinity }, rest = null
  for (const m of marks) {
    let n = 0, sum = [0, 0, 0]
    for (const [f, px, w] of m.body) {
      const rgb = over(px, alphaAtFrac(f, set))
      for (let i = 0; i < 3; i++) sum[i] += rgb[i] * w
      n += w
    }
    const body = sum.map(v => v / n)
    if (luma(body) < wb.y) wb = { y: luma(body), rgb: body, frame: m.frame }
    let eye = null
    for (const e of m.eyes) {
      const rgb = over(e.px, alphaAtFrac(e.f, set))
      if (!eye || rgb[1] < eye[1]) eye = rgb
      if (rgb[1] < we.g) we = { g: rgb[1], rgb, a: alphaAtFrac(e.f, set), frame: m.frame }
    }
    if (m.frame === 1) rest = { frame: m.frame, body, eye }
  }
  const { bodyY, eyeG } = set.markFloor
  const bodyOk = wb.y >= bodyY, eyeOk = we.g >= eyeG
  if (!bodyOk || !eyeOk) fail = 1
  console.log(`  the mark, worst case over the ${marks.length} frames it is resolvable in:`)
  console.log(`    ${bodyOk ? 'ok ' : '❌ '} body      renders ${hex(wb.rgb)}  luma ${wb.y.toFixed(0)} (floor ${bodyY}, source is 225) — frame ${wb.frame}`)
  console.log(`    ${eyeOk ? 'ok ' : '❌ '} eye       renders ${hex(we.rgb)}  g ${we.g.toFixed(0)} (floor ${eyeG}, #00E5FF is 229) — frame ${we.frame}, scrim ${we.a.toFixed(2)}`)
  if (rest) console.log(`    at the loop start (frame 1): body ${hex(rest.body)} luma ${luma(rest.body).toFixed(0)}, eye ${hex(rest.eye)} g ${rest.eye[1].toFixed(0)}`)
}
console.log(fail ? '\n❌ the hero fails — read the ❌ lines' : '\n✅ the copy clears AA over every frame AND the mark still reads')
process.exit(fail)
