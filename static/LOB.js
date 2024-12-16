size2 = size * size

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
for (let i=0; i < solution.length; i++) {
    solution[i] = solution[i] % 2
    solRatios[solution[i]]++

    // give all 'd' elements a transparent white border color
    document.getElementById('d'.concat(i.toString())).style.borderColor = "#00000000"

    // populate box counters
    boxCounters[i] = 0
    boxMissCounters[i] = 0
}


// toggleCounter state
TCState = 0

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
bubbleState = 0

// boolean tracker of whether animation delays are active
bubbleDelayState = false
genFlashDelayState = false



// Cycle between a list of text boxes to flash on screen
function bubbleCycle(delay) {
    if (!delay) {
        delay = 0
    }
    
    // prevent cycling if previous cycle's delay is ongoing
    if (!bubbleDelayState) {

        if (bubbleState <= bubbleList.length) {

            // if there's currently an active bubble, hide it.
            if (bubbleList[bubbleState]) {
                hide_element(bubbleList[bubbleState])
            }

            // if the next bubble exists, show it.
            if (bubbleList[bubbleState + 1]) {
                    document.getElementById(bubbleList[bubbleState + 1]).classList.remove('d-none')
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
        tColor = window.getComputedStyle(document.getElementById('d' + i.toString())).backgroundColor
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
function colorSwitch(element, elNum, noNum1, noNum2) {
    color = window.getComputedStyle(element).backgroundColor;
    for (i=0; i < colors.length; i++) {
        if (!noNum1) {
            countElement = 'p' + elNum.toString()
            countElement1 = countElement.getElementsByTagName('span')[0]
            if (!noP2) {
                countElement2 = countElement.getElementsByTagName('span')[1]
            }
        }
        if (color === colors[i]) {
            element.style.background = colors[(i+1) % colors.length]
            if (!noNum2) {
                countElement1.classList.add(textColors1[i])
                countElement1.classList.remove(textColors1[(i + 1) % 2])
                countElement2.classList.add(textColors2[i])
                countElement2.classList.remove(textColors2[(i + 1) % 2])
            }
        }
    }
}

// Check whether the board colors match the solution
function check() {
    correctCount = 0
    answer = []

    // count how many boxes are correct
    for (i=0; i < solution.length; i++) {
        tColor = window.getComputedStyle(document.getElementById('d' + i.toString())).backgroundColor
        boxGreen = decode_hex(tColor)[1]
        if (boxGreen > checkRigor) {answer[i] = 1}
        else {answer[i] = 0}
        if (answer[i] == solution[i]) {correctCount++}
    }

    // the metric the board is graded by
    gradeMessage = ''
    if (levelNum > 6) {finishMessage = 'Strength: '}
    else {finishMessage = 'Accuracy: '}

    // calculate how accurate the answer is
    accuracy = Math.round((count / solution.length) * 100)


    // perfect
    if (count == solution.length) {
        change_html('accInfo', gradeMessage + accuracy.toString() + '%')
        show_element('accInfo', 'sparkle-gifr', 'sparkle-gifl', 'nextLevel')
        check_flash('perfect')
        change_class(['guess', 'check'], 'box-glow')
        complete = 1
        setTimeout(() => {
            hide_element('sparkle-gifr', 'sparkle-gifl')
        }, "3000");
    }

    // good enough
    else if (count >= solution.length * closeEnough) {
        change_html('accInfo', gradeMessage + accuracy.toString() + '%')
        if (!complete) {
            show_element('accInfo', 'sparkle-gifr', 'sparkle-gifl', 'nextLevel')
            check_flash('win')
            change_class(['guess', 'check'], 'box-glow')
            complete = 1
            setTimeout(() => {
                hide_element('sparkle-gifr', 'sparkle-gifl')
            }, "3000")
        }
    }

    // try again
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
    
    for (chflshI=0;chflshI<3;chflshI++) {
        if (['win', 'perfect', 'fail'][chflshI] == win) {
            change_html(elID, ['Well Done!', 'Perfect!', 'Try Again!'][chflshI])
            change_class(elID, ['text-orange', 'text-orange', 'text-green'][chflshI], ['text-green', 'text-green', 'text-orange'][chflshI])
        }
    }
    animate_fade(elID, 0, 2000)
}

// input an accuracy float, create an semi-inaccurate version of the solution with the inputted accuracy, 
//and alter box border colors based on it.
function generateSolution() {
    genSolution = []
    for (let i=0; i < solution.length; i++) {
        if (Math.random() > acc) {
            genSolution[i] = (solution[i] + 1) % colors.length
        }
        else {
            genSolution[i] = solution[i]
        }   
    }
    return genSolution
}

// Generate a completely random solution, and adjust it so it has a similar on/off ratio to the main solution.
function advGenSol() {
    genSolution=[]
    changedIndex=[]
    // track which solution indexes haven't been changed, and make genSolution match the solution
    for (i=0; i<solution.length;i++) {
        changedIndex[i] = i
        genSolution[i] = solution[i]
    }

    // define a desired genAcc
    genAcc = (Math.random() / 3) + .4 + acc


    // calculate number of wrong squares to get this accuracy
    wrongs = Math.round((1 - genAcc) * solution.length)

    // alter the solution randomly to match tmpGenAcc
    for (i=0;i<wrongs;i++) {
        // select a random index from the changedIndex array
        tmpIndex = Math.floor(Math.random() * (solution.length - i))

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
    for (let i=0; i < solution.length; i++) {
    boxCounters[i] = boxCounters[i] + genSolution[i]  
        if (topCounter < boxCounters[i]) {
            topCounter = boxCounters[i]
        }
    }

    // check for lowest counter
    bottomCounter = boxCounters[0]
    for (let i=0; i < boxCounters.length; i++) {
        if (bottomCounter > boxCounters[i]) {
            bottomCounter = boxCounters[i]
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
    for (let i=0; i < solution.length; i++) {
    boxCounters[i] = boxCounters[i] + Math.round((genSolution[i] * (missDiff / hitDiff)))
        if (topCounter < boxCounters[i]) {
            topCounter = boxCounters[i]
        }
    }

    // check for lowest counter
    bottomCounter = boxCounters[0]
    for (let i=0; i < boxCounters.length; i++) {
        if (bottomCounter > boxCounters[i]) {
            bottomCounter = boxCounters[i]
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
    for (i=0;i<solution.length;i++) {
        if (genSolution[i] == 0){
            boxMissCounters[i]++
        }
    }
}

// update visuals for counter increases
function updateColor(type) {
    guessCount = 0
    if (levelNum > 2)
    {
        for (let i = 0; i < solution.length; i++) {
            document.getElementById('p' + i.toString()).getElementsByTagName('span')[0].innerHTML = boxCounters[i]
            if (levelNum > 3 && levelNum < 5) {
                document.getElementById('p' + i.toString()).getElementsByTagName('span')[1].innerHTML = boxMissCounters[i]
            }
        }
    }

    range = topCounter - bottomCounter

    // set border intensities based on range
    if (range > 5) {

        for (let i=0; i < solution.length; i++) {
            borderIntensity[i] = Math.round((boxCounters[i] - bottomCounter) / (range / 270))
            if (borderIntensity[i] > 255) {
                borderIntensity[i] = 255
            }
        }
    }
    else {
        for (let i=0; i < solution.length; i++) {
            borderIntensity[i] = Math.round((boxCounters[i] - bottomCounter) * 64)
            if (borderIntensity[i] > 255) {
                borderIntensity[i] = 255
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
    for (let i=0; i < solution.length; i++) {
        element = document.getElementById('d' + i.toString())
        alter[1] = borderIntensity[i]
        alter[3] = borderIntensity[i]
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
        if (boxCounters[i] >= 100) {
            element.classList.add('text-075')
        }
        if (boxCounters[i] >= 1000) {
            element.classList.remove('text-075')
            element.classList.add('text-05')
        }
    }
}

// Flash a generated solution on screen
function basicGenerate() {
    genSolution = generateSolution()
    totalGuessCount++
    change_class(['guess', 'check'], 'box-glow')
    if (counterLvl) {
        updateCounter(genSolution)
        updateColor('Border')
    }
    genFlash(genSolution)
}

// flash genSol on screen
function genFlash(genSolution) {

//checkpoint: I'm trying to make genFlash not be such an utter mess

    if (!document.getElementById('p0').classList.contains("d-none")) {
        toggleCounters()
    }

    boxOn = []



    if (!document.getElementById('di0').classList.contains('animate__animated')) {
        
        for (i=0; i<solution.length; i++) {
            boxOn[i] = decode_hex(window.getComputedStyle(document.getElementById('d' + i.toString())).backgroundColor)[1] > checkRigor
            if (!counterLvl) {

                if (genSolution[i] == 0) {
                    document.getElementById('di' + i.toString()).innerHTML = ''
                }
                else {
                    if (solution[i] == 1) {
                        if (boxOn[i]) {
                            document.getElementById('di' + i.toString()).innerHTML = "Nice!"
                        }
                        else {
                            document.getElementById('di' + i.toString()).innerHTML = "Click Me!"
                        }
                    }
                    else {
                        if (boxOn[i]) {
                            document.getElementById('di' + i.toString()).innerHTML = "Whoops"
                        }
                        else {
                            document.getElementById('di' + i.toString()).innerHTML = "(Not this)"
                        }
                    }
                }
            }
            else {
                if (genSolution[i] == 1) {
                    document.getElementById('di' + i.toString()).innerHTML = "Maybe?"
                }
                else {
                    document.getElementById('di' + i.toString()).innerHTML = ""
                }
            }
        }

        for (let i=0; i < solution.length; i++) { 
            document.getElementById('di' + i.toString()).classList.remove("d-none", backgroundColors[(genSolution[i] + 1) % 2], borderColors[(genSolution[i] + 1) % 2])
            document.getElementById('reliable').classList.remove("d-none")
            document.getElementById('p' + i.toString()).classList.add('d-none')
            document.getElementById('di' + i.toString()).classList.add("animate__animated", "animate__fadeIn", backgroundColors[genSolution[i]], borderColors[genSolution[i]])
        }
        
        setTimeout(() => {
            for (let i=0; i < solution.length; i++) { 
                document.getElementById('di' + i.toString()).classList.remove("animate__fadeIn")
                document.getElementById('di' + i.toString()).classList.add("animate__fadeOut")
            }
        }, "1500");

        setTimeout(() => {
            for (let i=0; i < solution.length; i++) { 
                document.getElementById('di' + i.toString()).classList.remove("animate__animated", "animate__fadeIn", "animate__fadeOut", backgroundColors[genSolution[i]], borderColors[genSolution[i]])
                document.getElementById('di' + i.toString()).classList.add("d-none")
                document.getElementById('reliable').classList.add("d-none")
                if (document.getElementById('p0').classList.contains("d-none") && TCState == 0) {
                    toggleCounters()
                }
            }
            if (levelNum == 4) {
                document.getElementById('hitInfo').classList.remove('d-none')
                document.getElementById('missInfo').classList.remove('d-none')
            }
        }, "2500");
    }
}

function removeGlow() {
    document.getElementById('guess').classList.remove('box-glow')
    if (totalGuessCount > 10000 / holdSpeed) {
        document.getElementById('check').classList.add('box-glow')
    }
}

function advancedGenerate(loops) {
    for (k=0;k<loops;k++) {
        if (levelNum == 4 && document.getElementById('di0').classList.contains('animate__animated') && totalGuessCount < bubbleList.length) {
            return 0
        }

        if (guessCount < maxGuess) {
            if (document.getElementById('tolerance').value == -2) {
                tolerance = 0
            }
            else if (document.getElementById('tolerance').value > -1) {
                tolerance = ((document.getElementById('tolerance').value / 20) + .24)
            }
            else {
                tolerance = (52 + ((1 / solRatio)) ** 1.2) / 100
            }

            for (i=0;i<bubbleGuessPoints.length;i++) {
                if (totalGuessCount == bubbleGuessPoints[i]) {
                    bubbleCycle()
                }
            }
            tmp = advGenSol()
            genSolution = tmp[0]
            genAcc = tmp[1]
            hit = 0

            // decide whether it's a hit or a miss
            if (genAcc > tolerance) {
                hit = 1
                hitCount++
            }
            else
            {
                hit = 0
                missCount++
            }
            // update counters
            if (hit) {
                if (levelNum == 4) {
                    document.getElementById('reliable').classList.remove('hidden', 'bg-maroon')
                    document.getElementById('reliable').classList.add('bg-dark-green')
                    document.getElementById('reliable').innerHTML = '<p class="text-center text-white">That was a good guess!</p>'
                }
                if (levelNum > 7) {
                    updateCounter2(genSolution)
                }
                else {
                    updateCounter(genSolution)
                }
            }
            else {
                updateMissCounter(genSolution)
                if (levelNum == 4) {
                    document.getElementById('reliable').classList.remove('hidden', 'bg-dark-green')
                    document.getElementById('reliable').classList.add('bg-maroon')
                    document.getElementById('reliable').innerHTML = "<p class='text-center text-white'>That wasn't a good guess...</p>"
                }
            }
            // if condense button hasn't been added yet, update immediately
            if (levelNum < 6) {
                updateColor('Border')
            }

            guessCount++
            totalGuessCount++
            updateHitMiss()

            if (levelNum < 5) {
                genFlash(genSolution)
            }

            if (levelNum < 6) {
                updateColor('Border')
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
}

// toggle the counters tracking how many times a box has bee guessed
function toggleCounters(toggle) {
    if (levelNum > 2)
    {
        if (toggle) {
            TCState = (TCState + 1) % 2
        }

        if (document.getElementById('p0').classList.contains("d-none"))
        {
            for (let i = 0; i < solution.length; i++) {
                document.getElementById('p' + i.toString()).classList.remove("d-none")
            }
        }
        else {
            for (let i = 0; i < solution.length; i++) {
                document.getElementById('p' + i.toString()).classList.add("d-none")
            }
        }
    }

}

function boardClear() {
    for (i=0;i<solution.length;i++) {
        boxCounters[i] = 0
        borderIntensity[i] = 0
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
