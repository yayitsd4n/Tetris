# JavaScript implementation of Tetris

## Resources

### The Tetris Guideline
* https://harddrop.com/wiki/Tetris_Guideline

### Random Generator
* http://tetris.wikia.com/wiki/Random_Generator
* https://harddrop.com/wiki/Random_Generator

### SRS
* http://tetris.wikia.com/wiki/SRS

### Game Loop
* [Game Programming Patterns loop chapter](http://gameprogrammingpatterns.com/game-loop.html)
* [Fix your time step](https://gafferongames.com/post/fix_your_timestep/)
* [JavaScript game loop](http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing)

### Key Press
* http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
* https://gablaxian.com/articles/creating-a-game-with-javascript/handling-user-input

---

## Todo
* ~~Hard-drop~~
* Scoring system
* Game speed
  * Gravity curve
* Soft-drop
* ~~Deleting rows~~
* Correct start locations
* ~~Ghost piece~~
* ~~Lose state~~
* ~~[DAS](https://harddrop.com/wiki/DAS)~~
* ~~[Lock delay](https://harddrop.com/wiki/Lock_delay)~~
  * ~~Manual lock~~
* Hold piece
* Sound?
  * Music
  * Sound effects
    * Rotate
    * Set piece
    * Lock delay
    * Delete row
    * Game over

* Pause
* UI
  * Board style
  * Piece style
  * Next 3
  * Points
  * Level
  * Time played
  * Background
    * https://api.nasa.gov/api.html#authentication
  * Start screen
  * Game over screen
* Effects
  * Hard drop
    * Speed trails. Change cell color and fade out.
  * Soft drop
    * Maybe the same thing as hard drop
  * Delete row
    * Transition to white
    * Show points. Transition up and fade out.
  * Lock delay
    * Transition to white. Transition to piece color.
  * Background
    * Crossfade