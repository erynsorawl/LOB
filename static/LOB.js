colors = ['rgb(0, 0, 255)', 'rgb(0, 255, 255)']
borderColors = ['border-blue', 'border-cyan']
textColors1 = ['text-black', 'text-lime']
textColors2 = ['text-red', 'text-orange']
backgroundColors = ['bg-blue', 'bg-cyan']
cases = [[0, 0, 10, 10], [0, 10, 10, 10]]
size2 = size * size
s = '0'


try {
    s = new URLSearchParams(window.location.search).get('seed')
    if (s.length) {

    }
}
catch {
    s='0'
    new_puzzle()
}

try {
    if (guessLoops) {

    }
}
catch {
    guessLoops = 1
}

// If on a mobile device, quadruple guess count and shrink some elements
if (window.screen.width <= 1000) {
    guessLoops = guessLoops * 4
    try {
        change_html(id_list('d0', solution.length), '', 'shrink')
    }
    catch{}
}

// If seed parameter is too long, reduce to a maximum of 100 characters.
if (s.length > 100)
{
    s = s.slice(0, 100)
}

// Turn seed parameter into an integer
seed = 0
for (i = 0; i < s.length; i++) {
    seed = seed + (s.charCodeAt(i) * (10 ** i))
}

// Create an array containing enough floats to generate a unique solution based on board size
seeds = []
seeds[0] = Math.round(seed * (Math.pow(790.83936443842, 20.96739876338635445)))
for (i = 1; i < size2 / 15; i++) {
    seeds[i] = Math.round(seed * (Math.pow((seeds[i-1] % 594.23936746878), 34.983263826382726)))
}

// define statistics for use in other functions
// array containing binary cell solutions
solution = []

// counters of 1s and 0s in the solution
solRatios = []
solRatios[0] = 0
solRatios[1] = 0

// counters for each cell
boxCounters = []
boxMissCounters = []

// last recorded hit and miss counters
lastMiss = 0
lastHit = 0

// number of guesses since last condense
guessCount = 0

totalGuessCount = 0

// bool of whether or not board has already been completed
complete = 0

// debug: calculate average accuracy
accTotal = 0
accCount = 0

// iterate over the seeds array and create solutions for each cell (15 per seed), up to board size
for (i = 0; i < seeds.length; i++) {

    tempSol = Array.from(Math.round(seeds[i] % (10 ** 15)).toString())
    for (j = 0; j < 15; j++) {

        if ((i * 15) + j >= size2) {
            break
        }
        if (!tempSol[j]) {
            tempSol[j] = 0;
        }
        solution[(i * 15) + j] = tempSol[j]
    }
}

// reduce solution numbers down to 1s and 0s
for (i=0; i < solution.length; i++) {
    solution[i] = solution[i] % 2
    solRatios[solution[i]]++

    // give all 'd' elements a transparent white border color
    document.getElementById('d' + i.toString()).style.borderColor = "#00000000"

    // populate box counters
    boxCounters[i] = 0
    boxMissCounters[i] = 0
}



// ratio of 1s to 0s
solRatio = solRatios[1] / solution.length

// counter statistics
hitCount = 0
missCount = 0
cleanCount = 0
topCounter = 0
bottomCounter = 0
range = 0

//debug counters
count1 = 0
count2 = 0
count3 = 0
count4 = 0

// array of border colors for each cell
borderIntensity = []

// current bubble
bubbleState = 1

// boolean tracker of whether animation delays are active
bubbleDelayState = false
genFlashDelayState = false

// trackers for which levels certain features are active on
counterLvl = false 
reliabilityLvl = false 
guessBoostLvl = false 
condenseLvl = false 
flashLvl = false
if (levelNum > 2 && levelNum < 5) {
    counterLvl = true
}
if (levelNum == 4) {
    reliabilityLvl = true
}
if (levelNum >= 8) {
    guessBoostLvl = true
}
if (levelNum >= 6) {
    condenseLvl = true
}
if (levelNum <= 4) {
    flashLvl = true
}



// Cycle between a list of text boxes to flash on screen
function bubbleCycle(delay) {
    
    // prevent cycling if previous cycle's delay is ongoing
    if (!bubbleDelayState) {

        if (bubbleState <= bubbleLength) {

            // hide the currently active bubble, and show the next one (if it exists)
            hide_element('bubble' + bubbleState)
            if (bubbleState < bubbleLength) {
                show_element('bubble' + (bubbleState + 1))
            }
            // move tracker to next bubble
            bubbleState++
            if (delay) {
                bubbleDelayState = true
                setTimeout(()=>{
                    bubbleDelayState = false
                }, delay)
            }
        }
    }
}

// cycle bubbles if board is complete  
function bubOnComplete() {
    count = 0
    answer = []
    for (i=0; i < solution.length; i++) {
        tColor = window.getComputedStyle(document.getElementById('d' + i)).backgroundColor
        boxGreen = decode_hex(tColor)[1]
        if (boxGreen > checkRigor) {
            answer[i] = 1
        }
        else {
            answer[i] = 0
        }

        if (answer[i] == solution[i]) {
                count++
            }
    }

    if (count >= solution.length * closeEnough) {
        bubbleCycle()
    }
}

// Cycle box color when box is clicked
function colorSwitch(element, elNum) {
    color = window.getComputedStyle(element).backgroundColor;
    for (csi=0; csi < colors.length; csi++) {
        countElement = document.getElementById('p' + elNum.toString())
        countElement1 = countElement.getElementsByTagName('span')[0]
        if (reliabilityLvl) {
            countElement2 = countElement.getElementsByTagName('span')[1]
        }
        if (color === colors[csi]) {
            element.style.background = colors[(csi+1) % colors.length]
            countElement1.classList.add(textColors1[csi])
            countElement1.classList.remove(textColors1[(csi + 1) % 2])
            if (reliabilityLvl) {
                countElement2.classList.add(textColors2[csi])
                countElement2.classList.remove(textColors2[(csi + 1) % 2])
            }
        }
    }
}

// Check whether the board colors match the solution
function check() {
    correctCount = 0
    answer = []

    // count how many boxes are correct
    for (ci=0; ci < solution.length; ci++) {
        tColor = window.getComputedStyle(document.getElementById('d' + ci)).backgroundColor
        boxGreen = decode_hex(tColor)[1]
        if (boxGreen > checkRigor) {answer[ci] = 1}
        else {answer[ci] = 0}
        if (answer[ci] == solution[ci]) {correctCount++}
    }

    // the metric the board is graded by
    gradeMessage = ''
    if (levelNum > 6) {gradeMessage = 'Strength: '}
    else {gradeMessage = 'Accuracy: '}

    // calculate how accurate the answer is
    accuracy = Math.round((correctCount / solution.length) * 100)


    // perfect
    if (correctCount == solution.length) {
        change_html('accInfo', gradeMessage + accuracy.toString() + '%')
        show_element('accInfo', 'sparkle-gif-right', 'sparkle-gif-left', 'nextLevel')
        check_flash('perfect')
        change_class(['guess', 'check'], 'box-glow')
        complete = 1
        setTimeout(() => {
            hide_element('sparkle-gif-right', 'sparkle-gif-left')
        }, "3000");
    }

    // good enough
    else if (correctCount >= solution.length * closeEnough) {
        change_html('accInfo', gradeMessage + accuracy.toString() + '%')
        if (!complete) {
            show_element('accInfo', 'sparkle-gif-right', 'sparkle-gif-left', 'nextLevel')
            check_flash('win')
            change_class(['guess', 'check'], 'box-glow')
            complete = 1
            setTimeout(() => {
                hide_element('sparkle-gif-right', 'sparkle-gif-left')
            }, "3000")
        }
    }

    // keep going
    else {
        change_html('accInfo', gradeMessage + accuracy.toString() + '%')
        if (!complete) {
            show_element('accInfo')
            change_class(['guess', 'check'], 'box-glow')
            check_flash('fail')
        }
    }
}

// flash a 'Well Done' or 'Try Again' message on screen
function check_flash(win) {
    elID = 'win-fail'
    
    for (cfi=0;cfi<3;cfi++) {
        if (['win', 'perfect', 'fail'][cfi] == win) {
            change_html(elID, ['Well Done!', 'Perfect!', 'Keep Going!'][cfi])
            change_class(elID, ['text-orange', 'text-orange', 'text-green'][cfi], ['text-green', 'text-green', 'text-orange'][cfi])
        }
    }
    animate_fade(elID, 1, 2000)
}

// input an accuracy float, create an semi-inaccurate version of the solution with the inputted accuracy, 
//and alter box border colors based on it.
function generateSolution() {
    genSolution = []
    for (let ci=0; ci < solution.length; ci++) {
        if (Math.random() > acc) {
            genSolution[ci] = (solution[ci] + 1) % colors.length
        }
        else {
            genSolution[ci] = solution[ci]
        }   
    }
    return genSolution
}

// Generate a completely random solution, and adjust it so it has a similar on/off ratio to the main solution.
function advGenSol() {
    genSolution=[]
    changedIndex=[]
    // track which solution indexes haven't been changed, and make genSolution match the solution
    for (agsi=0; agsi<solution.length;agsi++) {
        changedIndex[agsi] = agsi
        genSolution[agsi] = solution[agsi]
    }

    // define a desired genAcc
    genAcc = (Math.random() / 3) + .33 + acc

    // debug: calculate average accuracy
    accTotal = accTotal + genAcc
    accCount++


    // calculate number of wrong squares to get this accuracy
    wrongs = Math.round((1 - genAcc) * solution.length)

    // alter the solution randomly to match tmpGenAcc
    for (agsi=0;agsi<wrongs;agsi++) {
        // select a random index from the changedIndex array
        tmpIndex = Math.floor(Math.random() * (solution.length - agsi))

        // flip that cell in the genSolution
        genSolution[changedIndex[tmpIndex]] = (genSolution[changedIndex[tmpIndex]] + 1) % 2

        // remove that index from the array
        changedIndex.splice(tmpIndex, 1)
    }

    return [genSolution, genAcc]
}

// update boxCounter array
function updateCounter(genSolution) {
    // check for highest counter and update counter array
    for (let uci=0; uci < solution.length; uci++) {
    boxCounters[uci] = boxCounters[uci] + genSolution[uci]  
        if (topCounter < boxCounters[uci]) {
            topCounter = boxCounters[uci]
        }
    }

    // check for lowest counter
    bottomCounter = boxCounters[0]
    for (let uci=0; uci < boxCounters.length; uci++) {
        if (bottomCounter > boxCounters[uci]) {
            bottomCounter = boxCounters[uci]
        }
    }
}

// update boxCounter array, but with a bonus based on number of misses
function updateCounter2(genSolution) {
    // calculate number of hits and misses since last update
    hitDiff = hitCount - lastHit
    missDiff = missCount - lastMiss
    if (missDiff < 1) {
        missDiff = 1
    }
    if (hitDiff > missDiff)
    {
        hitDiff = missDiff
    }

    // check for highest counter and update counter array
    // multiply counter increase by ratio of hits to misses
    for (let uc2i=0; uc2i < solution.length; uc2i++) {
    boxCounters[uc2i] = boxCounters[uc2i] + Math.round((genSolution[uc2i] * (missDiff / hitDiff)))
        if (topCounter < boxCounters[uc2i]) {
            topCounter = boxCounters[uc2i]
        }
    }

    // check for lowest counter
    bottomCounter = boxCounters[0]
    for (let uc2i=0; uc2i < boxCounters.length; uc2i++) {
        if (bottomCounter > boxCounters[uc2i]) {
            bottomCounter = boxCounters[uc2i]
        }
    }
}

// update hit and miss counters
function updateHitMiss() {
    // update hit and miss counts
    document.getElementById('hitInfo').innerHTML = ("Hits: " + hitCount.toString())
    document.getElementById('missInfo').innerHTML = ("Misses: " + missCount.toString())
}

function updateMissCounter(genSolution) {
    for (umci=0;umci<solution.length;umci++) {
        if (genSolution[umci] == 0){
            boxMissCounters[umci]++
        }
    }
}

// update visuals for counter increases
function updateColor(type) {
    guessCount = 0
    if (levelNum > 2)
    {
        for (let uci = 0; uci < solution.length; uci++) {
            document.getElementById('p' + uci).getElementsByTagName('span')[0].innerHTML = boxCounters[uci]
            if (levelNum > 3 && levelNum < 5) {
                document.getElementById('p' + uci).getElementsByTagName('span')[1].innerHTML = boxMissCounters[uci]
            }
        }
    }

    range = topCounter - bottomCounter

    // set border intensities based on range
    if (range > 5) {

        for (let uci=0; uci < solution.length; uci++) {
            borderIntensity[uci] = Math.round((boxCounters[uci] - bottomCounter) / (range / 300))
            if (borderIntensity[uci] > 255) {
                borderIntensity[uci] = 255
            }
        }
    }
    else {
        for (let uci=0; uci < solution.length; uci++) {
            borderIntensity[uci] = Math.round((boxCounters[uci] - bottomCounter) * 64)
            if (borderIntensity[uci] > 255) {
                borderIntensity[uci] = 255
            }
        }
    }

    // change blue amount based on range
    alter = [0, 0, 0, 0]
    if (range > 5) {
        alter[2]= 255
    }
    else {
        alter[2] = range * 48
    }

    // set border colors
    for (let uci=0; uci < solution.length; uci++) {
        element = document.getElementById('d' + uci)
        alter[1] = borderIntensity[uci]
        alter[3] = borderIntensity[uci]
        if (alter[2] > alter[3]) {
            alter[3] = alter[2]
        }
        rgba = "rgba(0, 0, 0, 0)"
        rgba = alter_hex(rgba, alter)
        if (type == 'Border') {
            element.style.borderColor = rgba
        }
        if (type == 'Box') {
            element.style.backgroundColor = rgba
        }
        // reduce font size if counters are too large
        if (boxCounters[uci] >= 100) {
            element.classList.add('text-075')
        }
        if (boxCounters[uci] >= 1000) {
            element.classList.remove('text-075')
            element.classList.add('text-05')
        }
    }
}

// Flash a generated solution on screen
function basicGenerate() {
    for (bgi=0;bgi<guessLoops;bgi++) {
        genSolution = generateSolution()
        totalGuessCount++
        change_class(['guess', 'check'], 'box-glow')
        if (counterLvl) {
            updateCounter(genSolution)
            updateColor('Border')
        }
        genFlash(genSolution)
    }
}

// flash genSol on screen
function genFlash(genSolution) {
    // if animation isn't already running for this function
    if (!genFlashDelayState) {

        boxOn = []

        // if counters are visible, hide them.
        hide_element(id_list('p', solution.length))

        for (gfi=0;gfi<solution.length;gfi++) {
            // set the ID of the box currently being edited
            boxID = 'di' + gfi
            // determine whether each box is on or off
            boxOn[gfi] = decode_hex(window.getComputedStyle(document.getElementById('d' + gfi)).backgroundColor)[1] > checkRigor

            // if level doesn't use counters
            if (!counterLvl) {

                // if generated box is off, remove text
                if (genSolution[gfi] == 0) {
                    change_html(boxID, '')
                }
                // otherwise, add text
                else {
                    // if the solution for this box is on
                    if (solution[gfi] == 1) {
                        // if active box, generated box, and solution all match, say 'Nice!'
                        if (boxOn[gfi]) {
                            change_html(boxID, 'Nice!')
                        }
                        // if active and generated boxes match, but the box isn't currently on, say 'Click Me!'
                        else {
                            change_html(boxID, 'Click Me!')
                        }
                    }
                    // if the solution for this box is off
                    else {
                        // if box is active when it shouldn't be, say 'Whoops'
                        if (boxOn[gfi]) {
                            change_html(boxID, 'Whoops')
                        }
                        // if it's off and it should be, say 'not this'
                        else {
                            change_html(boxID, '(not this)')
                        }
                    }
                }
            }
            // if level does use counters
            else {
                // if generated box is on, say 'Maybe?'
                if (genSolution[gfi] == 1) {
                    change_html(boxID, 'Maybe?')
                }

                // if generated box is off, say nothing
                else {
                    change_html(boxID, '')
                }
            }

            // for the generated box, remove the opposite background and border colors, add the correct ones, reveal the 'reliability' box, hide the counters
            change_class(boxID, [backgroundColors[(genSolution[gfi] + 1) % 2], borderColors[(genSolution[gfi] + 1) % 2]], [backgroundColors[genSolution[gfi]], borderColors[genSolution[gfi]]])
            show_element('reliability')
            hide_element('p' + gfi)
        }

        animate_fade(id_list('di', solution.length), 1, 1500)
        genFlashDelayState = true

        // when animation is finished, revert changes and reveal hit/miss info if not already visible
        setTimeout(()=>{
            for (gfi=0;gfi<solution.length;gfi++) {
                change_class('di' + gfi, [backgroundColors[genSolution[gfi]], borderColors[genSolution[gfi]]])
                hide_element('reliability', 'di' + gfi)
            }
            if (counterLvl) {
                show_element(id_list('p', solution.length))
            }
            genFlashDelayState = false
        }, 2500)
        if (reliabilityLvl) {
            setTimeout(()=>{
                show_element('hitInfo', 'missInfo')
            }, 2500)
        }
    }
}

function advancedGenerate() {
    if (guessCount < maxGuess) {

        for (agi=0;agi<guessLoops;agi++) {

            if (document.getElementById('standards').value == -2) {
                standards = 0
            }
            else if (document.getElementById('standards').value > -1) {
                standards = ((document.getElementById('standards').value / 20) + .17)
            }
            else {
                standards = (47 + ((1 / solRatio)) ** 1.2) / 100
            }

            // retrieve values from advGenSol
            tmp = advGenSol()
            genSolution = tmp[0]
            genAcc = tmp[1]
            hit = false

            // decide whether it's a hit or a miss
            if (genAcc > standards) {
                hit = true
                hitCount++
            }
            else
            {
                missCount++
            }
            // if it's a hit, update counters
            if (hit) {
                if (reliabilityLvl) {
                    change_class('reliability', ['d-none', 'bg-maroon'], 'bg-dark-green')
                    change_html('reliability', '<p class="text-center text-white">That was a good guess!</p>')
                }
                if (guessBoostLvl) {
                    updateCounter2(genSolution)
                }
                else {
                    updateCounter(genSolution)
                }
            }

            // otherwise, update miss counters and show reliability (if available)
            else {
                updateMissCounter(genSolution)
                if (reliabilityLvl) {
                    change_class('reliability', ['d-none', 'bg-dark-green'], 'bg-maroon')
                    change_html('reliability', "<p class='text-center text-white'>That wasn't a good guess...</p>")
                }
            }
            // if condense button hasn't been added yet, update immediately
            if (!condenseLvl) {
                updateColor('Border')
            }

            guessCount++
            totalGuessCount++
            updateHitMiss()

            if (flashLvl) {
                genFlash(genSolution)
            }
        }
    }
}

// generate a new seed and redirect
function new_puzzle() {
    dir = window.location.href
    if (dir.split('?').length > 1) {
        window.location.replace(dir.split('?')[0] + '?seed=' + Math.floor(Math.random() * 1000000000))
    }
    else {
        window.location.replace(dir + '?seed=' + Math.floor(Math.random() * 1000000000))
    }
c}

function boardClear() {
    for (bci=0;bci<solution.length;bci++) {
        boxCounters[bci] = 0
        borderIntensity[bci] = 0
    }
    hitCount = 0
    missCount = 0
    cleanCount = 0
    topCounter = 0
    bottomCounter = 0
    range = 0
    lastMiss = 0
    lastHit = 0
    guessCount = 0
    totalGuessCount = 0
    updateColor('Border')
    updateHitMiss()
}
