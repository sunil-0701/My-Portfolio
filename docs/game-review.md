# Dino playground: manual review

These checks are an opt-in review guide, not an automated run or a record of
passing results. Do not start a dev server, build, browser check, or GitHub Actions
run without authorization. The quality workflow remains manual-only.

## Loading and closing

- Open Play using a mouse, touch, and the keyboard. The game should load only
  when requested, then receive keyboard focus.
- With the game module loading slowly, activate Play repeatedly. Only one open
  request should be accepted, with a loading announcement while it is pending.
- If the playground unmounts during loading, the completed request must not
  reopen the removed game.
- Close with Escape or the close button. During the exit transition, game
  controls should stop receiving keyboard or pointer input. After the transition,
  focus should return to Play.
- If the module cannot load, expect a failure announcement and a focused Back
  button. The failed module is cached for this page session; a fresh page load is
  needed to attempt the download again.

## Canvas availability

- In a browser with canvas rendering disabled, Play should show an explanatory
  message instead of a blank, apparently playable surface.
- The Back to contours button should receive focus and restore the playground
  when activated. The rest of the portfolio should remain usable.

## Input and pausing

- Start a run, then use Space, Arrow Up, and a primary tap or click to jump.
  Holding a jump key should not trigger repeated jumps.
- Right-clicks and secondary touches should not jump. Modified keyboard
  shortcuts should remain available to the browser.
- Press P to pause and resume. Space or Arrow Up on the paused canvas should
  resume; a subsequent press jumps. Paused time should not advance the score.
- Hide the browser tab, scroll the game out of view, or move focus outside the
  entire game, including its buttons. The run should pause.
- Return to the page/game. It should remain paused until explicitly resumed,
  without advancing obstacles to catch up with time spent away.
- Move focus between the canvas, pause, and close controls. Moving within the
  game should not count as leaving it.

## Motion and saved scores

- Change the operating system's reduced-motion preference while the page is
  open. Contours should become still; the game should omit decorative ground
  movement and running strides while keeping user-triggered gameplay usable.
- Changing that preference mid-run should not reset the score or obstacles.
- Complete runs in two same-origin tabs. Best should synchronize between tabs,
  and a lower score should not replace a higher stored score.
- With browser storage blocked, the game should still be playable. Persistence
  is optional; an in-memory best can last only while the game remains mounted.

## Related source

- `src/components/hero/HeroPlayground.jsx`: loading, transitions, and return focus.
- `src/components/hero/DinoGame.jsx`: canvas, input, pause state, and saved scores.
- `src/components/hero/HeroContours.jsx`: decorative motion and pointer response.
- `src/hooks/usePageVisible.js`: browser visibility subscription.

No checks in this guide have been executed as part of the six-commit batch that
introduced it.
