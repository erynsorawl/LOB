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

// last recorded hit and miss counters
lastMiss = 0
lastHit = 0

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

// array of border colors for each cell
borderIntensity = []

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
        console.log(boxGreen)
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
        alert('Well done! Score: ' + Math.round((count / solution.length) * 100) + '%')
    }
    else {
        alert('Try again! Progress: ' + Math.round((count / solution.length) * 100)  + '%')
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
    genOnCount = 0
    genOffCount = 0
    genOnIndex = []
    genOffIndex = []

    // populate the genSolution array with randomized neuron activations
    for (let i=0; i < solution.length; i++) {
        genSolution[i] = Math.round(Math.random() * 10) % 2
        if (genSolution[i] == 1) {
            genOnCount++
            genOnIndex.push(i)
        }
        else {
            genOffCount++
            genOffIndex.push(i)
        }
        
        // if the generated solution has too many on cells, reduce them to desired levels
        if (genOnCount > solRatios[1] + Math.round(solution.length/8)) {
            n = genOnIndex[Math.round(Math.random() * genOnIndex.length)]
            genSolution[n] = 0
            genOnCount = genOnCount - 1
        }
        // if the generated solution has too many off cells, reduce them to desired levels
        if (genOffCount > solRatios[0] + Math.round(solution.length/8)) {
            n = genOffIndex[Math.round(Math.random() * genOffIndex.length)]
            genSolution[n] = 0
            genOnCount = genOnCount - 1
        }
        
    }    
    return genSolution
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

// update boxCounter array, but with a bonus based on number of hits
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

// update visuals for counter increases
function updateColor(type) {

    // update counter visuals
    for (let i = 0; i < solution.length; i++) {
        document.getElementById('d' + i.toString()).firstChild.innerHTML = boxCounters[i]
    }

    range = topCounter - bottomCounter

    // set border intensities based on range
    if (range > 20) {

        for (let i=0; i < solution.length; i++) {
            borderIntensity[i] = Math.round((boxCounters[i] - bottomCounter) / (range / 320))
            if (borderIntensity[i] > 255) {
                borderIntensity[i] = 255
            }
        }
    }
    else {
        for (let i=0; i < solution.length; i++) {
            borderIntensity[i] = Math.round((boxCounters[i] - bottomCounter) * 16)
            if (borderIntensity[i] > 255) {
                borderIntensity[i] = 255
            }
        }
    }

    // change blue amount based on range
    alter = [0, 0, 0, 0]
    if (range > 20) {
        alter[2]= 255
    }
    else {
        alter[2] = range * 12
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
    }
}

// Flash a generated solution on screen
function basicGenerate() {
    genSolution = generateSolution()

    if (!document.getElementById('di0').classList.contains('animate__animated')) {

        for (let i=0; i < solution.length; i++) { 
            cL = document.getElementById('di' + i.toString()).classList
            cL.remove("hidden")
            cL.add("animate__animated", "animate__fadeOut", backgroundColors[genSolution[i]], borderColors[genSolution[i]])
        }
        
        setTimeout(() => {
            for (let i=0; i < solution.length; i++) { 
                cL = document.getElementById('di' + i.toString()).classList
                cL.add("hidden")
                cL.remove("animate__animated", "animate__fadeOut", backgroundColors[genSolution[i]], borderColors[genSolution[i]])
            }
        }, "1000");
    }
}

// Adjust border colors based on generated solution
function mediumGenerate() {
    genSolution = generateSolution()
    updateCounter(genSolution)
    updateColor('Border')
    
}

// Adjust border colors based on generated solution if it is more than a certain amount accurate to the main solution
function advancedGenerate(loops, condense, missBonus) {
    if (loops > maxLoops) {
        loops = maxLoops
    }
    for (l = 0; l < loops; l++) {
        genSolution = advGenSol()
        genCor = 0
        genAcc = 0
        hit = 0

        // Calculate how accurate genSolution is
        for (let i=0; i < solution.length; i++) {
            if (genSolution[i] == solution[i]) {
                genCor++
            }
        }

        genAcc = genCor / solution.length

        // decide whether it's a hit or a miss
        if (genAcc > document.getElementById('tolerance').value / 100) {
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
            if (missBonus) {
                updateCounter2(genSolution)
            }
            else {
                updateCounter(genSolution)
            }
        } 
    }

    updateHitMiss()

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
function toggleCounters() {
    if (document.getElementById('d0').firstChild.classList.contains("hidden"))
    {
        for (let i = 0; i < solution.length; i++) {
            document.getElementById('d' + i.toString()).firstChild.classList.remove("hidden")
        }
    }
    else {
        for (let i = 0; i < solution.length; i++) {
            document.getElementById('d' + i.toString()).firstChild.classList.add("hidden")
        }
    }

}

// switch between notes and game, with animation
function notes() {
    tableEl = document.getElementById('centerBox')

    // if an animation isn't already running
    if (!tableEl.classList.contains('animate__animated') || !document.getElementById('notes').classList.contains('animate__animated')) {

        // if the game is currently hidden
        if (tableEl.classList.contains('hidden', 'd-none')) {

            // fade out the notes
            document.getElementById('notes').classList.add("animate__animated", "animate__fadeOut")

            // wait until notes are done fading out, then hide them and fade in the game
            setTimeout(() => {
                document.getElementById('notes').classList.add('hidden', 'd-none')
                tableEl.classList.remove('hidden', 'd-none')
                tableEl.classList.add("animate__animated", "animate__fadeIn", "d-flex")
                document.getElementById('buttons').classList.remove('hidden', 'd-none')
                document.getElementById('buttons').classList.add("animate__animated", "animate__fadeIn")
            }, "1000");

            // wait until game is done fading in, then remove all animation tags
            setTimeout(() => {
                tableEl.classList.remove("animate__animated", "animate__fadeIn", "animate__fadeOut")
                document.getElementById('buttons').classList.remove("animate__animated", "animate__fadeIn", "animate__fadeOut")
                document.getElementById('notes').classList.remove("animate__animated", "animate__fadeIn", "animate__fadeOut")
            }, "2000");
        }

        // if the game isn't hidden
        else {

            // fade out the game
            tableEl.classList.add("animate__animated", "animate__fadeOut")
            document.getElementById('buttons').classList.add("animate__animated", "animate__fadeOut")

            // wait until game is done fading out, then hide it and fade in the notes
            setTimeout(() => {
                tableEl.classList.add('hidden', 'd-none')
                document.getElementById('buttons').classList.add('hidden', 'd-none')
                document.getElementById('notes').classList.remove('hidden', 'd-none')
                document.getElementById('notes').classList.add("animate__animated", "animate__fadeIn")
            }, "1000");

            // wait until the notes are done fading in, then remove all animation tags
            setTimeout(() => {
                tableEl.classList.remove("animate__animated", "animate__fadeIn", "animate__fadeOut")
                document.getElementById('buttons').classList.remove("animate__animated", "animate__fadeIn", "animate__fadeOut")
                document.getElementById('notes').classList.remove("animate__animated", "animate__fadeIn", "animate__fadeOut")
            }, "2000");
        }
    }
}
