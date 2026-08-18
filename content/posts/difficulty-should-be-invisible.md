Every learning app has to answer one question before it writes a line of code: **what does the child
see when they get something wrong?**

The common answer is a score, a level and a streak. It is easy to build and it feels motivating in a
demo. In practice it turns a maths lesson into a verdict, and a child who has decided they are "a
level 2" stops trying to be anything else.

We took the other road. In AdaptiveLearn the difficulty moves constantly and is never shown.

## What "adaptive" actually means here

The engine tracks one thing per skill: how the child is doing right now.

- Three correct in a row, at eighty percent or better, and the difficulty goes up one tier.
- Six correct in a row at the top tier and the chapter ends early — the child has shown they know it,
  so we stop asking.
- Three wrong and the chapter stops scoring and teaches the idea again, from the beginning, with the
  same characters and a worked example.

None of that is on screen. There is no tier number, no percentage, no red cross. A child who is
finding it hard gets shorter questions and more teaching; a child who is finding it easy gets harder
ones and finishes sooner. Both of them just experience "the game".

## The part that is harder than it sounds

Hiding the level is the easy half. The hard half is making sure the questions are honest.

The moment you remove the visible score, you have to be certain that a right answer really means the
child knows something — because nothing else is measuring them. That rules out most of the question
formats an app would reach for by default:

- **Two options is a coin flip.** "Which is bigger?" over two choices is answered correctly half the
  time by a child who has learned nothing at all.
- **A printed question makes the picture beside it decoration.** If a chapter draws blocks to count
  and also prints `27 + 15 = ?` on a banner, the blocks are scenery and the child answers from the
  digits.
- **A repeatable commit is a yes/no oracle.** If a child can guess, read "not enough", adjust, and
  guess again, the answer falls out in about four tries with nothing worked out.

So every chapter is built around a gesture the skill actually requires. To learn measurement you lay
a unit down end to end and count it. To learn area you commit to a number of tiles *before* the floor
exists to be covered, so you cannot fill it until it looks finished. To answer a question about
counting in the youngest band, you hold that many fingers up to the camera.

## What we watch for

The failure mode of invisible difficulty is that nobody notices when it stops working — there is no
number on screen going wrong. So the checks are in the software rather than in the UI: a chapter
cannot finish until every idea it teaches has been asked at least once, and a question generator that
starts producing answerable-by-guessing rounds fails the build.

A child should be able to play for ten minutes, get most of it right, get a few wrong, and come away
with no idea that they were being measured at all. That is the whole design.
