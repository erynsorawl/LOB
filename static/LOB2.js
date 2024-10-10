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

// Use seed floats to create a unique solution that will always be the same given the same seed parameter, 
// and create some statistics describing the solution for use in other functions
solution = []
solRatios = []
for (let j=0; j < cases.length; j++) {
    solRatios[j] = 0
}
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

for (let i=0; i < solution.length; i++) {
    solution[i] = solution[i] % colors.length
    for (j = 0; j < cases.length; j++) {
        if (solution[i] == j) {
            solRatios[j]++
        }
    }

    // give all 'd' elements a transparent white border color
    document.getElementById('d'.concat(i.toString())).style.borderColor = '#00000000'
}

solRatio = solRatios[1] / solution.length
console.log(solRatio)

hitCount = 0
missCount = 0
cleanCount = 0


function alter_hex(rgba, rgbaAlter)
{
    // convert rgba string into a list of rgba values
    rgba = rgba.split(/,| |\(|\)/)
    max = 0

    // if it's an rgb value, set a to max
    if (!rgba[7]) {
        rgba[7] = '1'
    }
    indicies = [1, 3, 5]
    rgbaVal=['', '', '', '']
    for (i = 0; i < indicies.length; i++) {
        rgbaVal[i] = Math.floor(parseInt(rgba[indicies[i]]))
    }
    rgbaVal[3] = Math.floor(rgba[7] * 255) 

    // if a is higher than the highest rgb value, set it equal instead
    max = 0
    for (i = 0; i < 3; i++) {
        if (rgbaVal[i] > max) {
            max = rgbaVal[i]
        }
    }

    if (rgbaVal[3] > max) {
        rgbaVal[3] = max
    }

    // alter rgba values based on inputs, with a maximum of 255 and a minimum of 0.

    for (i=0; i<4; i++) {
        rgbaVal[i] = rgbaVal[i] + rgbaAlter[i]
        if (rgbaVal[i] > 255){
            rgbaVal[i] = 255
        }
        if (rgbaVal[i] < 0) {
            rgbaVal[i] = 0
        }
    }


    // convert rgba values into a hex code, and return it.
    nHex = ''
    for (i = 0; i < 4; i++) {
        hexlet = rgbaVal[i].toString(16)
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


// Check whether the current pattern matches the solution
function check(alt) { 
    let count = 0
    for (let i=0; i < solution.length; i++) {
        let tColor = window.getComputedStyle(document.getElementById('t'.concat(i.toString()))).backgroundColor
    if (tColor === colors[solution[i]]) {
            count++
        }
    }

    if (count >= solution.length * closeEnough) {
        alert('Well done! Accuracy: ' + Math.round((count / solution.length) * 100) + '%')
        console.log(count)
    }
    else {
        alert('Try again! Accuracy: ' + Math.round((count / solution.length) * 100)  + '%')
        console.log(count, solution.length)
    }
}


function cheat() {
    for (let i=0; i < solution.length; i++) { 
        // give all 'd' elements a border color
        document.getElementById('d'.concat(i.toString())).style.borderColor = '#00000000'   
    }
}

function clean(amount) {
    console.log('Clean!')
    for (j = 0; j < solution.length; j++) {
        element = document.getElementById('d' + j.toString())
        rgba = element.style.borderColor
        rgba = alter_hex(rgba, amount)
        element.style.borderColor = rgba
    }
    cleanCount++
    document.getElementById('cleans').innerHTML = ("Clean x" + cleanCount.toString())
}


function superClean() {
    while (true) {
        lows = 0
        for (k = 0; k < solution.length; k++) {
            element = document.getElementById('d' + k.toString())
            rgba = element.style.borderColor
            rgba = rgba.split(/,| |\(|\)/)
            for (l=0; l < 2; l++) {
                if (rgba[l] == 0) {
                    lows++
                }
            }
        }
        if (lows > 1) {
            break
        }
        clean()
    }
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

function superGuess(times) {
    for (k = 0; k < times; k++){
        generate2()
    }
}


// input an accuracy float, create an semi-inaccurate version of the solution with the inputted accuracy, 
//and alter box border colors based on it.
function generate(noDarken, noFlash, loops) {
    if (!loops) {
        loops = 1
    }
    for (l = 0; l < loops; l++) {
        genSolution = []
        for (let i=0; i < solution.length; i++) {
            if (Math.random() > acc) {
                genSolution[i] = (solution[i] + 1) % colors.length
            }
            else {
                genSolution[i] = solution[i]
            }
            
        }

        if (!noDarken) {

            for (let i=0; i < solution.length; i++) {
                element = document.getElementById('d' + i.toString())
                rgba = element.style.borderColor
                    for (j=0; j<cases.length; j++) {
                        if (genSolution[i] == j) {
                            rgba = alter_hex(rgba, cases[j])
                        }
                    }

                element.style.borderColor = rgba
            }   
        }

        if (!noFlash) {
            genFlash(genSolution)
        }
    }
}

function advancedGenerate(loops) {
    for (l = 0; l < loops; l++) {
        genSolution = []
        genCor = 0
        genAcc = 0
        hit = 0

        // populate the genSolution array with randomized neuron activations
        for (let i=0; i < solution.length; i++) {
            genSolution[i] = Math.round(Math.random() * 10) % 2
            // give it a percent chance to activate or deactivate based on solution ratio.
            if (solRatio <= .5 && genSolution[i] == 1) {
                if (Math.random() / 2.0 > .5 - solRatio) {
                    genSolution[i] = 0
                }
            }
            else if (solRatio > .5 && genSolution[i] == 0){
                if (Math.random() / 2.0 < solRatio - .5) {
                    genSolution[i] = 1
                }
            }

        }

        // Calculate how accurate it is to the solution
        for (let i=0; i < solution.length; i++) {
            if (genSolution[i] == solution[i]) {
                genCor++
            }
        }

        genAcc = genCor / solution.length

        // decide whether it's a hit miss, or ambiguous
        if (genAcc > .55 ) {
            hit = 1
            hitCount++
        }
        else if (genAcc > .45)
        {
            hit = 0
            missCount++
        }
        else {
            hit = 2
        }
        if (hit != 2) {
            for (let i=0; i < solution.length; i++) {
                element = document.getElementById('d' + i.toString())
                rgba = element.style.borderColor
                if (genSolution[i] == 0) {
                    rgba = alter_hex(rgba, cases[0])
                }
                else {
                    if (hit) {
                        rgba = alter_hex(rgba, cases[1])
                    }
                    else {
                        rgba = alter_hex(rgba, [0, -3, 0, 0])
                    }
                }

                element.style.borderColor = rgba
            }
        }    
    }
    document.getElementById('hit').innerHTML = ("Hit x" + hitCount.toString())
    document.getElementById('miss').innerHTML = ("Miss x" + missCount.toString())
}

function genFlash(genSolution) {
    if (!document.getElementById('di0').classList.contains('animate__animated')) {

        for (let i=0; i < solution.length; i++) { 
            cL = document.getElementById('di' + i.toString()).classList
            cL.remove("hidden")
            cL.add("animate__animated", "animate__fadeOut", borderColors[genSolution[i]])
        }
        
        setTimeout(() => {
            for (let i=0; i < solution.length; i++) { 
                cL = document.getElementById('di' + i.toString()).classList
                cL.add("hidden")
                cL.remove("animate__animated", "animate__fadeOut", borderColors[genSolution[i]])
            }
        }, "1000");
    }
}


function new_puzzle() {
    dir = window.location.href
    if (dir.split('?').length > 1) {
        window.location.replace(dir.split('?')[0] + '?seed=' + Math.floor(Math.random() * 1000000000))
    }
    else {
        window.location.replace(dir + '?seed=' + Math.floor(Math.random() * 1000000000))
    }
}

