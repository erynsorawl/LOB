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

console.log(solRatios)

// convert a hex code into a list of rgba values
function decode_hex(rgba) {
    // convert rgba string into a list of rgba values
    rgba = rgba.split(/,| |\(|\)/)
    max = 0

    // if it's an rgb value, set a to max
    if (!rgba[7]) {
        rgba[7] = '1'
    }
    indicies = [1, 3, 5]
    rgbaVal=['', '', '', '']
    for (ck = 0; ck < indicies.length; ck++) {
        rgbaVal[ck] = Math.floor(parseInt(rgba[indicies[ck]]))
    }
    rgbaVal[3] = Math.floor(rgba[7] * 255) 
    return rgbaVal
}

// take an rgba value and an array of 4 integers,  adjust the rgba value based on these integers, and return the adjusted rgba value
function alter_hex(rgba, rgbaAlter)
{
    rgbaVal = decode_hex(rgba)

    // if a is higher than the highest rgb value, set it equal instead
    max = 0
    for (pk = 0; pk < 3; pk++) {
        if (rgbaVal[pk] > max) {
            max = rgbaVal[pk]
        }
    }

    if (rgbaVal[3] > max) {
        rgbaVal[3] = max
    }

    // alter rgba values based on inputs, with a maximum of 255 and a minimum of 0.

    for (pk=0; pk<4; pk++) {
        rgbaVal[pk] = rgbaVal[pk] + rgbaAlter[pk]
        if (rgbaVal[pk] > 255){
            rgbaVal[pk] = 255
        }
        if (rgbaVal[pk] < 0) {
            rgbaVal[pk] = 0
        }
    }


    // convert rgba values into a hex code, and return it.
    nHex = ''
    for (pk = 0; pk < 4; pk++) {
        hexlet = rgbaVal[pk].toString(16)
        if (hexlet.length < 2) {
            nHex = nHex + '0' + hexlet
        }
        else {
            nHex = nHex + hexlet
        }
    }
    nHex = '#' + nHex
    return nHex
}

// Cycle box color when box is clicked
function colorSwitch(element) {
    let color = window.getComputedStyle(element).backgroundColor;
    for (let i=0; i < colors.length; i++) {
        if (color === colors[i]) {
            element.style.background = colors[(i+1) % colors.length]
        }
    }
}

// Check whether the board colors match the solution
function check() {
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

    accuracy = Math.round((count / solution.length) * 100)

    if (count == solution.length) {
        document.getElementById('accInfo').innerHTML = 'Accuracy: ' + accuracy.toString() + '%'
        document.getElementById('accInfo').classList.remove('hidden')
        document.getElementById('sparkle-gifr').classList.remove('hidden')
        document.getElementById('sparkle-gifl').classList.remove('hidden')
        document.getElementById('nextLevel').classList.remove('d-none')
        check_flash('perfect')
        document.getElementById('check').classList.remove('box-glow')
        complete = 1
        setTimeout(() => {
            document.getElementById('sparkle-gifr').classList.add('hidden')
            document.getElementById('sparkle-gifl').classList.add('hidden')
        }, "3000");
    }
    else if (count >= solution.length * closeEnough) {
        document.getElementById('accInfo').innerHTML = 'Accuracy: ' + accuracy.toString() + '%' 
        if (!complete) {
        document.getElementById('accInfo').classList.remove('hidden')
        document.getElementById('sparkle-gifr').classList.remove('hidden')
        document.getElementById('sparkle-gifl').classList.remove('hidden')
        document.getElementById('nextLevel').classList.remove('d-none')
        check_flash('win')
        document.getElementById('check').classList.remove('box-glow')
        complete = 1
        setTimeout(() => {
            document.getElementById('sparkle-gifr').classList.add('hidden')
            document.getElementById('sparkle-gifl').classList.add('hidden')
        }, "3000");}
    }
    else {
        document.getElementById('accInfo').innerHTML = 'Accuracy: ' + accuracy.toString() + '%' 
        if (!complete) {
            document.getElementById('accInfo').classList.remove('hidden')
            document.getElementById('check').classList.remove('box-glow')
            document.getElementById('guess').classList.add('box-glow')
            check_flash()
        }
    }
}

// flash a 'Well Done' or 'Try Again' message on screen
function check_flash(win) {
    el = document.getElementById('win-fail')

    if (win == 'win') {
        el.innerHTML = "Well done!"
        el.classList.remove('text-orange')
        el.classList.add('text-green')
    }
    else if (win == 'perfect') {
        el.innerHTML = "Perfect!"
        el.classList.remove('text-orange')
        el.classList.add('text-green')
    }
    else {
        el.innerHTML = "Try again!"
        el.classList.remove('text-green')
        el.classList.add('text-orange')
    }

    if (!el.classList.contains('animate__animated')) {
        
        el.classList.remove('d-none')
        el.classList.add('animate__animated', 'animate__fadeIn')

        // wait two seconds, then fade it out again
        setTimeout(() => {
            el.classList.remove('animate__fadeIn')
            el.classList.add('animate__fadeOut')
        }, 2000)

        // wait one second, then set display back to none
        setTimeout(() => {
            el.classList.remove('animate__animated', 'animate__fadeOut')
            el.classList.add('d-none')
        }, 3000)
    }
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
    genAcc = (Math.random() / 4) + acc
    console.log(genAcc)

    // calculate number of wrong squares to get this accuracy
    wrongs = Math.round((1 - genAcc) * solution.length)
    console.log(wrongs)

    // alter the solution randomly to match tmpGenAcc
    for (i=0;i<wrongs;i++) {
        // select a random index from the changedIndex array
        tmpIndex = Math.floor(Math.random() * (solution.length - i))
        // flip that cell in the genSolution
    
        genSolution[changedIndex[tmpIndex]] = (genSolution[changedIndex[tmpIndex]] + 1) % 2

        // remove that index from the array
        changedIndex.splice(tmpIndex, 1)
    }

    console.log(changedIndex)

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
    for (let i = 0; i < solution.length; i++) {
        document.getElementById('d' + i.toString()).getElementsByTagName('span')[0].innerHTML = boxCounters[i]
        document.getElementById('d' + i.toString()).getElementsByTagName('span')[1].innerHTML = boxMissCounters[i]
    }

    range = topCounter - bottomCounter

    // set border intensities based on range
    if (range > 5) {

        for (let i=0; i < solution.length; i++) {
            borderIntensity[i] = Math.round((boxCounters[i] - bottomCounter) / (range / 320))
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

// button holding function
let holdit = (btn, action, start, speedup, limit) => {
    let t;
    let startValue = start;

    let repeat = () => {
        action();
        t = setTimeout(repeat, startValue);
        (startValue > limit) ? startValue /= speedup: startValue = limit;
    }

    btn.onmousedown = () => {
        repeat();
    }

    const stopActionEvents = ['mouseup', 'mouseout'];

    stopActionEvents.forEach(event => {
        btn.addEventListener(event, () => {
            clearTimeout(t);
            startValue = start;
        })
    });

};

// Flash a generated solution on screen
function basicGenerate() {
    genSolution = generateSolution()
    totalGuessCount++
    document.getElementById('guess').classList.remove('box-glow')
    document.getElementById('check').classList.add('box-glow')
    if (counterLvl) {
        updateCounter(genSolution)
        updateColor('Border')
    }
    if (totalGuessCount == hintThreshold) {
        document.getElementById('hint').classList.remove('hidden', 'd-none')
        document.getElementById('hint').classList.add('animate__animated', 'animate__fadeIn')
    }
    genFlash(genSolution)
}

// flash genSol on screen
function genFlash(genSolution) {
    if (!document.getElementById('p0').classList.contains("hidden")) {
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
            document.getElementById('di' + i.toString()).classList.remove("hidden", backgroundColors[(genSolution[i] + 1) % 2], borderColors[(genSolution[i] + 1) % 2])
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
                document.getElementById('di' + i.toString()).classList.add("hidden")
                document.getElementById('reliable').classList.add("hidden")
                if (document.getElementById('p0').classList.contains("hidden") && TCState == 0) {
                    toggleCounters()
                }
            }
        }, "2500");
    }
}

// Adjust border colors based on generated solution if it is more than a certain amount accurate to the main solution
if (hold) {
    holdit(document.getElementById('guess'), advancedGenerate(), 1000, 4, holdSpeed)
}

function removeGlow() {
    document.getElementById('guess').classList.remove('box-glow')
    if (totalGuessCount > 10000 / holdSpeed) {
        document.getElementById('check').classList.add('box-glow')
    }
}

function advancedGenerate() {
    if (document.getElementById('tolerance').value == -2) {
        tolerance = 0
    }
    else if (document.getElementById('tolerance').value > -1) {
        tolerance = document.getElementById('tolerance').value / 100
    }
    else {
        tolerance = (52 + ((1 / solRatio)) ** 1.2) / 100
    }

    if (totalGuessCount == hintThreshold) {
        document.getElementById('hint').classList.remove('hidden', 'd-none')
        document.getElementById('hint').classList.add('animate__animated', 'animate__fadeIn')
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
            document.getElementById('reliable').innerHTML = '<p class="text-center text-white">This guess is somewhat reliable.</p>'
        }
        if (missBonus) {
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
            document.getElementById('reliable').innerHTML = '<p class="text-center text-white">This guess is unreliable.</p>'
        }
    }
    guessCount++
    // if condense button hasn't been added yet, update immediately
    if (levelNum < 6) {
        updateColor('Border')
    }

totalGuessCount++
updateHitMiss()

    if (flash) {
        genFlash(genSolution)
    }

    if (!condense) {
        updateColor('Border')
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
    if (toggle) {
        TCState = (TCState + 1) % 2
    }

    if (document.getElementById('p0').classList.contains("hidden"))
    {
        for (let i = 0; i < solution.length; i++) {
            document.getElementById('p' + i.toString()).classList.remove("hidden")
        }
    }
    else {
        for (let i = 0; i < solution.length; i++) {
            document.getElementById('p' + i.toString()).classList.add("hidden")
        }
    }

}

// close hints
function hint() {
    document.getElementById('hint').classList.remove("animate__fadeIn")
    document.getElementById('hint').classList.add('animate__fadeOut')
    setTimeout(() => {
        document.getElementById('hint').classList.add('hidden', 'd-none')
    }, 1000)
}
