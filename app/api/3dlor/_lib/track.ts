/**
 * What a customer sees after payment: the stages of an order, like a parcel, worked out from the order and its videos.
 * Nothing here is typed by hand, so a stage cannot say something the rows do not.
 */
export const ROUNDS = 2
export const NOTE_MAX = 2000

export type VideoStatus = 'planned' | 'script_review' | 'script_changes' | 'in_work' | 'video_review' | 'video_changes' | 'approved'
export type Video = {
  id: string; order_id: string; position: number; title: string; status: VideoStatus; script: string | null
  video_path: string | null; final_path: string | null; rounds_used: number; customer_note: string | null; updated_at: string
}

/** Where a customer's answer takes a video, or null when the video does not wait for them. */
export function decide(v: Pick<Video, 'status' | 'rounds_used'>, action: unknown): { status: VideoStatus; rounds_used: number } | null {
  if (action !== 'approve' && action !== 'change') return null
  if (v.status === 'script_review') return { status: action === 'approve' ? 'in_work' : 'script_changes', rounds_used: v.rounds_used }
  if (v.status === 'video_review') {
    if (action === 'approve') return { status: 'approved', rounds_used: v.rounds_used }
    return v.rounds_used < ROUNDS ? { status: 'video_changes', rounds_used: v.rounds_used + 1 } : null
  }
  return null
}

export const waitsForCustomer = (v: Pick<Video, 'status'>) => v.status === 'script_review' || v.status === 'video_review'

/** The words on a video's row. */
export const STATUS_WORDS: Record<VideoStatus, string> = {
  planned: 'We write the script', script_review: 'Check the script', script_changes: 'We change the script',
  in_work: 'We make the video', video_review: 'Check the video', video_changes: 'We change the video', approved: 'Approved',
}

export type Stage = { title: string; line: string; state: 'done' | 'now' | 'next'; you?: boolean; at?: string | null }

export function timeline(o: { created_at: string; paid_at: string | null; balance_paid: boolean; videos_ordered: number }, videos: Video[], hasManual: boolean): Stage[] {
  const n = videos.length
  const scripted = videos.filter(v => ['in_work', 'video_review', 'video_changes', 'approved'].includes(v.status)).length
  const made = videos.filter(v => ['video_review', 'video_changes', 'approved'].includes(v.status)).length
  const approved = videos.filter(v => v.status === 'approved').length
  const scriptsWait = videos.filter(v => v.status === 'script_review').length
  const videosWait = videos.filter(v => v.status === 'video_review').length
  const all = Math.max(n, o.videos_ordered)
  const latest = videos.map(v => v.updated_at).sort().at(-1) ?? null
  const last = (done: boolean) => (done ? latest : null)

  const rows: (Omit<Stage, 'state'> & { done: boolean })[] = [
    { title: 'Order placed', line: `${o.videos_ordered} videos`, done: true, at: o.created_at },
    { title: 'First half paid', line: 'Thank you.', done: true, at: o.paid_at },
    { title: 'We read your manual', line: n > 0 ? `${n} videos planned` : hasManual ? 'Your video list comes next.' : 'Upload your manual below.', done: n > 0, you: n === 0 && !hasManual },
    { title: 'You approve the scripts', line: scriptsWait ? `${scriptsWait} to check` : `${scripted} of ${all} approved`, done: scripted >= all && n > 0, you: scriptsWait > 0 },
    { title: 'We make the videos', line: `${made} of ${all} made`, done: made >= all && n > 0 },
    { title: 'You check the videos', line: videosWait ? `${videosWait} to check` : `${approved} of ${all} approved`, done: approved >= all && n > 0, you: videosWait > 0, at: last(approved >= all && n > 0) },
    { title: 'Second half paid', line: o.balance_paid ? 'Thank you.' : 'We send you the invoice at delivery.', done: o.balance_paid },
    { title: 'Delivered', line: 'All files are yours to download.', done: approved >= all && n > 0 && o.balance_paid },
  ]
  // Work overlaps (a script can wait while a video is made): the first open stage is "now", and so is every later one that waits for you.
  const first = rows.findIndex(r => !r.done)
  return rows.map(({ done, ...r }, i) => ({ ...r, state: done ? 'done' : i === first || r.you ? 'now' : 'next' }))
}
