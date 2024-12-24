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
before ending with a fun animation of Numbers Going Update


# PYTHON #

I started this project with the idea that I could make all of the webpages in a local Flask environment
with no back-end processes besides template generation, then copy the generated HTML and paste it into other files
when I was finished testing to create a fully client-side website.

I have since realized that was a Mistake.

While I did get this to work eventually, it was horrifically inefficient due to the differences betwenn a local
environment and an online environment, as well as the differences between desktop and mobile browsers. It's already
done, but if I ever make another client-side website, I'll be doing it much differently.


# JINJA/HTML #

To start, we have the Flask-typical main.py and views.py, both containing the bare essentials to generate a webpage
and create URL links, with a few Flask variables added to help generate dynamic webpages. That's all of the python
in this project, so let's move onto the HTML.

The HTML consists of one base.html, which all other pages are built on top of. This includes things such as the
navbar, and links to various CSS and Javascript files,

Two prototypes are built on top of base.html: lvl.html and lesson.html. lvl.html focuses on universal game mechanics, 
while lesson.html focuses on creating a more basic environment, letting you add slideshow elements with minimal clutter.

The rest of the pages are built off of one of these two, either relating to a level in the game, or a section
in the lesson. The only exceptions are index.hmtl (starting screen), lvlFinish.html (the ending choice between
returning to the start or continuing to the lesson), and imgmake, which was an environment I used to screenshot
various gamestates for use in the lesson that would have been difficult to program otherwise.
In addition, each file often has a few Javascript functions specific to each page, and a few global variables
that help calibrate the global LOB.js to that specific page's needs.
Besides that, each file also contains a number of HTML elements, each contained in a Jinja block that will
help slot them into the correct spots in their webpage.

In the /pages folder, we have the generated results of the Flask/Jinja contained in their own files to be easily
acessed without any need for back-end servers, with the URLs updated to match how they'd look in Github Pages.

If I ever do this again, I'll probably set all URL links using Javascript instead of HTML, it would've been a much
easier to make the change that way.

Besides that, the only differences should be those that I forgot to synchronize after all the bug-testing I've been
doing since getting them on Pages.


# CSS #

I've separated the CSS for this project into three files: one for simple color-changing classes, one for simple size-changing
classes, and one for everything else. These contain a large number of one-line or two-line classes, letting me have more
control over each individual HTML element. I've done my best to condense and trim as many of them after I completed the 
project, to make the HTML more readable, but I've unfortunately run out of time, so I'll have to leave it where it is for now.

Most in this site are based on absolute positioning, with relative positioning only applying to children
of absolutely-positioned parents. To help with this, I've created a global variable called --screen-unit, to help
me position elements regardless of font size. This also helps me adjust the ratio of elements size to font size
on smaller viewports.

In styles_colors.css, I define the names of all the colors I used in my color pallette for this website, allowing me to adjust each
of them globally. This was meant to help me experiment with color relationships, and help the site look more pleasing overall.

In styles_sizes.css, I give myself some basic sizing classes for height, width, and font size, with three defining variables:
em, rem, and --screen-unit. These helped me to more accurately define the relationships between various elements.

styles.css is split into three sections: element classes, which served as groups of style options for reocurring elements with
many applied styles; positioning classes, which define the positioning and relationships of various elements; and media queries,
which adjust the site based on the size of the user's screen. There's also a miscellaneous section, for elments that didn't quite
fit into any of the other categories.


# JAVASCRIPT #

Excluding the page-specific Javascript in the HTML files, this project contains two main Javascript files: 
LOB.js and tools.js.

tools.js mostly contains functions that are simple and mostly used by various other functions, while 
LOB.js contains more single-purpose actions. I've done my best to keep my Javascipt well-commented, 
including syntax so I don't forget how to use it.

LOB.js has a section dedicated to various page-start processes, but the vast majority of the file is
made of functions that are called at some point during gameplay, ordered alphabetically. I won't be 
going into detail with every single function in the file, but I will mention some of the more prevalent
and complicated functions.

On startup, the program expects a 'seed' variable to be passed via GET, and if there isn't one, it'll
randomly generate a 10-digit seed and reload the page. This was done this way so that, if the player
reloaded the page, they would be given the same hidden solution.
I experimented with using POST, but the confirmation it asked for every time was a little too
annoying. I also tried hiding the GET variables once the page was loaded, but I couldn't find anything
that would do so without reloading the page.
The seed is then sent through a series of mathematical processes, until it's turned into an array
containing binary values for every box in the game's grid, called 'solution'. This array appears in
almost every function in the file.

When the 'Guess' button is clicked, it activates either basicGenerate() or advancedGenerate(). basicGenerate()
has a few mechanics that are depreciated in later levels, while advancedGenerate() has a few mechanics
that don't appear until later levels.
Both of them mathematically generate a randomized pattern







# ROOM FOR IMPROVEMENT #

* Dynamic page generation approach was horribly inefficient
* CSS classes could be condensed into fewer, more relevant classes
* Relationships between elments could have been defined better
* Could have had more built-in error catches in Javascript, instead of trying to avoid all triggers
* (personal) Minimal knowledge of web design 
* Not enough comments
* Couldn't figure out how to hide GET variables without reloading the page
* Got rid of the 'let' in basically every variable, like an absolute buffoon. 
* Could have replaced the excessive number of bubble elements with individual bubble elements and
  a function to change the inner text
* Probably a lot of other stuff that I'm too inexperienced to notice



