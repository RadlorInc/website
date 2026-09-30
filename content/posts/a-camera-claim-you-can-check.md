Every app that turns on a camera in front of a child says the same thing: *we don't store the video.*
It is the cheapest sentence in software. It costs nothing to write, nothing to publish, and nothing to
keep saying after it stops being true.

The question worth asking is not whether an app promises not to upload. It is whether the app **can**.

## The difference between a promise and an architecture

A promise is a sentence in a privacy policy. It is enforced by whoever remembers it, and it survives
exactly as long as the person who wrote it stays at the company.

An architecture is different. If there is no code that uploads a frame, no frame is uploaded — not
because anybody is being careful, but because there is nothing to run. And if the browser is also
instructed to refuse what the app is not allowed to do, then adding that code later is not a quiet
one-line change. It breaks visibly, in front of whoever tries.

## What changed on 20 September 2026

When this post was first written, Radlic had camera chapters: in the 9–11 band a child could answer
by holding fingers up or tilting a hand, and the hand tracking ran inside the browser. The post
described how that was built so nothing could leave the device.

Those chapters are gone. We removed them on 20 September 2026, along with the 9–11 band they lived in.
Radlic now has no camera feature at all, and the stronger version of the claim is now the true one:
the app does not merely avoid uploading video — the browser will not let it open a camera.

## The three things that make it checkable

**One: the browser is told the app may not use a camera.** Radlic sends a `Permissions-Policy`
header with `camera=()`, and the same for the microphone and location. With that header in place, a
request for the camera from the app is refused by the browser before any prompt reaches the child.
Adding a camera back would mean changing that header, in public, not slipping a call into a screen.

**Two: the browser is told what the app is allowed to contact.** The app ships a content security
policy whose `connect-src` names its permitted destinations explicitly — the app itself, its
database, and the server its recorded lessons are played from. A request to anywhere else does not
fail quietly; the browser refuses it.

**Three: both are covered by a test.** There is a test asserting what those headers contain, and it
fails the build if they change. When the camera chapters were removed, the test was turned around on
purpose: it used to require the file servers the hand tracking was downloaded from, and it now fails
if any of them comes back without the code that needs it. A permission nobody uses is reach nobody
re-examines.

None of those three is impressive on its own. Together they mean the claim does not depend on trust.

## How to check this about any app

The three things above are not special to us. You can look for them in anything your child uses:

- **Read the response headers for `Permissions-Policy`.** If it says `camera=()`, the app cannot use
  the camera even if it tried. If the camera is allowed, ask what for.
- **Read the response headers for `Content-Security-Policy`.** If there is a `connect-src` with a
  short list on it, the app has constrained where it can talk to. If there is no policy at all, the
  app can contact anywhere, and the only thing stopping it is intent.
- **Open the browser's network tab and use the app.** Every request it makes is listed. If frames
  were being uploaded you would see a steady stream of requests carrying a lot of data, timed with
  the camera rather than with anything you clicked.
- **Ask what happens when you refuse the camera.** An app that treats the camera as optional has to
  have built the other way through. An app that degrades or blocks has told you what it thinks the
  camera is for.

## Why this is worth the trouble

Cameras in children's software deserve the suspicion they get. The way to answer that suspicion is
not a warmer sentence in a privacy policy. It is to build the thing so the sentence would be hard to
make false, and to say plainly when the thing itself changes — including when a feature this post
once described is no longer there.

A claim you can check is worth more than a claim you have to believe.
