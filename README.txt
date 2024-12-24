# Learn Outside The Box
#### Video Demo:  <URL HERE>
#### Description:

Learn Outside The Box is a client-side webgame designed as a roundabout way of teaching basic
neuroscience mechanics. All of the game's programming is based on the actual neuroscientific
mechanisms that drive learning in the human brain, and the game itself is designed to help people
gain an intuitive understanding of these mechanics, and how to leverage that information in their 
day-to-day life.

This repository includes a set of pre-made webpages to be easily accessed, a flask 
framework for developers to dynamically generate and test these pages, as well as multiple 
Javascript and CSS files to support them.


# GAME MECHANICS #

The basic premise of the game revolves around a grid of blues squares that turn
cyan based on the player's actions. The goal of the game is to make the grid match the
coloration of a pre-determined pattern, which will have to be discovered using the
game's mechanics.

As the game progresses, the grid will slowly get larger, and more and more mechanics
will be added.

The game starts out with a 3x3 grid, two buttons at the bottom of the screen ('scan' and 'submit'), 
and a speech bubble teaching the player the basics of how to play the game.
The 'scan' button is also highlighted, drawing the user's attention to it. When clicked, a 
pattern of cyan and blue squares will flash on screen, with the cyan ones saying 'Click Me!'
For the first level, this pattern will match the hidden solution exactly. 
When all of the 'Click Me!' squares are clicked, the 'Submit' button will be highlighted, and
will flash a success message and animation on screen, along with an 'Accuracy' stat that
tells the player how many squares they got right, and a 'Next' button that takes the player to the 
next level

On the second level, the flashed pattern from the 'scan' button is now completely random, and no longer the same 
as the hidden solution. However, each square in the grid will still have a message telling the player
whether the pattern was correct.

On the third level, the squares no longer inform the player of whether they're correct or not. 
Instead, the flashed pattern becomes somewhat more accurate to the hidden solution, and the player
gains a set of trackers (numerical and visual) for each box in the grid, telling the player how many times it's flashed cyan.
The more times the player uses the 'scan' button, the more statistically likely it'll be that the
boxes with the highest appearance counts are cyan in the hidden solution.
If the player is on mobile, each click of the 'scan' button will count triple, due to how difficult it is to 
click quickly on mobile.

On the fourth level, the flashed pattern becomes completely random. However, the player will be told 
which patterns are more that 50% accurate to the hidden solutiion, and which ones are less than 50% accurate.
Only the patterns over 50% accurate will be added to the trackers, allowing the player to continue anyways.

On the fifth level, the pattern is no longer flashed on screen, and the numerical trackers are also removed, 
making the player rely entirely on the visual representations of the trackers instead. 
In addition, the number of scans per click is doubled to account for a larger board.

On the sixth level, the 'Update' mechanic is introduced, making it so all of the player's progress is invisible
until the 'Update' button is pressed. This is an absolutely terrible decision from a game design perspective, 
but it's almost essential for the lesson section.

On the seventh level, the player loses the ability to click the boxes in the grid manually. Instead, pattern that
is submitted at the end of the level is decided entirely by the visual trackers. 
The player also gains access to the 'Standards' mechanic, which allows them to increase or decrease the
accuracy requirements for a pattern to be added to the trackers. If set to the lowest or highest values,
the game won't progress, and values in-between have varying effects on game progression.

On the eighth level, the player is given a boost for higher-accuracy Standards, making up for how they
usually don't appear as often.

On the ninth and final level, the board is increased to ridiculous sizes, letting the player go wild
with all the mechanics they have access to.


# LESSON #

After beating the final level, the player is given a choice of whether to go back to the first level, or to
learn more about how the game mechanics relate to neuroscience.

These lessons are structured in a slideshow format, with the player choosing when to move to the next
slide. It focuses heavily on callbacks to the game's levels and mechanics, and comparing them to similar,
but life-applicable examples, such as basketball.

This lesson is chunked into six sections. The first section is an introduction, along with a basic explanation
of what the grid represents.

The second section explains the basic function of the 'scan' mechanic, as it appears in the third level.

The third section focuses on the 'Update' mechanic, with an emphasis on real-world examples.

The fourth section focuses on the 'Standards' mechanic, with a contrast of gameplay-focused visuals and reality-focused text
helping to connect the two.

The fifth section takes a step back to explain some other neuroscientific mechanics that couldn't quite fit 
into the game itself, but could still be explained using the real-life examples used throughought the lesson.

The sixth section is a conclusion, giving a quick refresher on everything that was learned during the lesson,
before ending with a 
