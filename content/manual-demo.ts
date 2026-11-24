/**
 * The demo of home and /3dlor: one written manual page and the frames that show it (the water filter sample, 2026-11-24).
 * `from` is the first frame of each step in `public/stop/water-filter/NNN.webp`; `still` is where its action is clearest.
 * The manual text is ours, not a maker's; its sources are in the sample's SOURCES.md. The filter is generic and unbranded.
 */
export const MANUAL = {
  dir: '/stop/water-filter',
  frames: 320,
  w: 1200,
  h: 900,
  product: 'Water filter',
  title: 'Change the cartridges',
  warning: 'Close the water before you open a canister. Do not over-tighten: it can cause a leak.',
  steps: [
    { from: 40, still: 64, text: "Put a tray below the unit. Close the cold water valve. Open the filter faucet until the water stops, to release the pressure." },
    { from: 74, still: 102, text: "Put the wrench around the first canister. Seen from below, turn it counterclockwise. Lower the full canister straight down." },
    { from: 113, still: 138, text: "Empty the canister, take out the old cartridge and wash the housing. The O-ring must be clean and flat in its groove." },
    { from: 148, still: 175, text: "Remove the plastic wrap. Stage 1: put the sediment cartridge in the clear canister, centered on the knob at the bottom." },
    { from: 185, still: 212, text: "Stage 2: the granular carbon cartridge goes in with the rubber washer up. Stage 3: put in the carbon block." },
    { from: 223, still: 242, text: "Turn each canister clockwise by hand until it stops. Then use the wrench for only a quarter to a half turn more." },
    { from: 264, still: 289, text: "Open the valve slowly and look for leaks. Let the faucet run until the water is clear." },
  ],
}

/**
 * The scroll film: frames chosen by how much the picture CHANGES, not by the clock, so each bit of scroll moves the picture by
 * the same amount (a frame each 1/5 s made every camera move jump; founder, 2026-11-24). `from` is each step's first frame.
 * The files are packs of webp frames: uint32 count, count × uint32 sizes, then the frames.
 */
export const FILM = { dir: '/stop/water-filter/film', packs: 32, count: 896, w: 1080, h: 810, from: [23, 150, 312, 421, 504, 626, 763] }

/** The whole product, put together. */
export const WHOLE = 319

export const frame = (n: number) => `${MANUAL.dir}/${String(n).padStart(3, '0')}.webp`
