Every app that turns on a camera in front of a child says the same thing: *we don't store the video.*
It is the cheapest sentence in software. It costs nothing to write, nothing to publish, and nothing to
keep saying after it stops being true.

The question worth asking is not whether an app promises not to upload. It is whether the app **can**.

## The difference between a promise and an architecture

A promise is a sentence in a privacy policy. It is enforced by whoever remembers it, and it survives
exactly as long as the person who wrote it stays at the company.

An architecture is different. If there is no code that uploads a frame, no frame is uploaded — not
because anybody is being careful, but because there is nothing to run. And if the browser is also
instructed to refuse connections to anywhere except a short list of destinations, then adding that
code later is not a quiet one-line change. It breaks visibly, on the allowlist, in front of whoever
tries.

That is the shape of the claim on AdaptiveLearn's camera chapters, and it is deliberately made in a
form somebody outside the company can check.

## What actually happens on the device

In the 9–11 band a child can answer by holding fingers up, tilting a hand to set an angle, or holding
two hands apart to say how wide something is.

The tracking that reads those gestures runs inside the browser. A frame arrives from the camera, gets
turned into a handful of coordinates, is compared against the expected answer, and is discarded. All
of it on the child's own machine. The coordinates are as short-lived as the frame — they are not
stored, and they are not the sort of thing that gets stored later "for analytics", because there is
nowhere for them to go.

## The three things that make it checkable

**One: there is no upload path.** Not a disabled one, not one behind a flag. No function in the
application sends a frame or a hand position anywhere.

**Two: the browser is told what the app is allowed to contact.** The app ships a content security
policy whose `connect-src` names its permitted destinations explicitly — the database, and the two
file servers described below. A request to anywhere else does not fail quietly; the browser refuses
it. This is the part that matters most, because it constrains the app's *future* as well as its
present.

**Three: the policy is covered by a test.** The allowlist is not a setting somebody might loosen
during a busy week without noticing. There is a test asserting what the header contains, and it fails
the build if the answer changes.

None of those three is impressive on its own. Together they mean the claim does not depend on trust.

## The part we will not leave out

The hand-tracking software is not written by us. It is Google's MediaPipe, and like any library it
has to be downloaded the first time it is used — the code from jsDelivr, the model file from Google's
storage servers. Both of those hosts are on the allowlist, because without them the camera chapters
do not work at all.

So the honest version of the claim is this: those two servers see that a device asked them for a
file. That is the same thing every file server sees when any website loads any library. They are not
sent anything about the child, and they never see the camera.

We write that down rather than rounding it off, for the same reason the rest of this is checkable: a
claim with the awkward part removed is the one that gets found out.

## How to check this about any app

The three things above are not special to us. You can look for them in anything your child uses:

- **Open the browser's network tab and use the app.** Every request it makes is listed. If frames
  were being uploaded you would see a steady stream of requests carrying a lot of data, timed with
  the camera rather than with anything you clicked.
- **Read the response headers for `Content-Security-Policy`.** If there is a `connect-src` with a
  short list on it, the app has constrained where it can talk to. If there is no policy at all, the
  app can contact anywhere, and the only thing stopping it is intent.
- **Ask what happens when you refuse the camera.** An app that treats the camera as optional has to
  have built the other way through. An app that degrades or blocks has told you what it thinks the
  camera is for.

On that last one, ours is a real answer and not a gesture: every chapter that accepts a hand gesture
also accepts taps, with the same questions and the same scoring. A child who declines the camera
prompt lands on the tap version with nothing withheld. The camera is a nicer way to answer, never the
only one.

## Why this is worth the trouble

Cameras in children's software deserve the suspicion they get. The way to answer that suspicion is
not a warmer sentence in a privacy policy. It is to build the thing so the sentence would be hard to
make false, and then to say exactly where the edges are — including the two file servers, including
the fact that early software has parts that are not finished.

A claim you can check is worth more than a claim you have to believe.
