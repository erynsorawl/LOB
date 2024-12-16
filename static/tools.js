// take an rgba value and an array of 4 integers,  adjust the rgba value based on these integers, and return the adjusted rgba value
function alter_hex(rgba, rgbaAlter)
{
    rgbaValues = decode_hex(rgba)

    // alter rgba values based on inputs, with a maximum of 255 and a minimum of 0.

    for (ahexI=0; ahexI<4; ahexI++) {
        rgbaValues[ahexI] = rgbaValues[ahexI] + rgbaAlter[ahexI]
        if (rgbaValues[ahexI] > 255){
            rgbaValues[ahexI] = 255
        }
        if (rgbaValues[ahexI] < 0) {
            rgbaValues[ahexI] = 0
        }
    }


    // convert rgba values into a hex code, and return it.
    newHex = ''
    for (ahexI = 0; ahexI < 4; ahexI++) {
        hexlet = rgbaValues[ahexI].toString(16)

        // if hexlet is less than 10, add a 0 in front
        if (hexlet.length < 2) {
            newHex = newHex + '0' + hexlet
        }
        else {
            newHex = newHex + hexlet
        }
    }
    newHex = '#' + newHex
    return newHex
}

// Fade an element in or out, with the option of reverting after a certain delay 
// syntax: element IDs, 0 (fade in) or 1 (fade out), duration (if you'd like to do the other afterwards) minimum one second,
// be sure not to call the function again until the animation duration (plus one second) is over!
function animate_fade(elements, type, duration, tracker) {
    types = ['animate__fadeIn', 'animate__fadeOut']

    if (duration < 1000) {
        duration = 1000
    }

    if (typeof(elements) == 'string') {
        elements = [elements]
    }

    for (anifadI=0;anifadI<elements.length;anifadI++) {
        elements[anifadI].classList.remove(types[(type+1)%2])
        elements[anifadI].classList.add(types[type])
        elements[anifadI].classList.remove('d-none')
        if (duration) {
            setTimeout(() => {
                elements[anifadI].classList.remove(types[type])
                elements[anifadI].classList.add(types[(type+1)%2])
                if (type && duration > 1000) {
                    elements[anifadI].classList.add('d-none')
                    setTimeout(() => {
                        elements[anifadI].classList.remove('d-none')
                    }, duration - 1000)
                }
            }, duration)
            setTimeout(() => {
                elements[anifadI].classList.remove(types[(type+1)%2])
                if (!type) {
                    elements[anifadI].classList.add('d-none')
                }
            }, duration + 1000)
        }
    }
}

// change the inner HTML of a list of elements
// syntax: a list of element IDs and a string of HTML
function change_html(elIDs, newHTML) {
    if (typeof(elIDs) == 'string') {
        elIDs = [elIDs]
    }

    for (i=0;i<elIDs.length;i++) {
        document.getElementById(elIDs[i]).innerHTML = newHTML
    }
}

// convert a hex code into a list of rgba values
function decode_hex(rgba) {
    // convert rgba string into a list of rgba values
    rgba = rgba.split(/,| |\(|\)/)
    max = 0

    // if it's an rgb value, set alpha channel to max
    if (!rgba[7]) {
        rgba[7] = '1'
    }

    // select the indicies that contain rgb values
    indicies = [1, 3, 5]

    rgbaValues=['', '', '', '']
    for (dhexI = 0; dhexI < indicies.length; dhexI++) {
        rgbaValues[dhexI] = Math.floor(parseInt(rgba[indicies[dhexI]]))
    }
    rgbaValues[3] = Math.floor(rgba[7] * 255) 
    return rgbaValues
}

// Set a list of elements to 'display-none'
// syntax: list element IDs ('',)
function hide_element(/**/) {
    for (hideI=0;hideI<arguments.length;hideI++) {
        document.getElementById(arguments[hideI]).classList.add('d-none')
    }
}

// Add and remove classes from an element/elements
// syntax: an element's ID, an array of classes to remove, and an array of classes to add ('', [], [])
function change_class(elIDs, remClasses, addClasses) {
    args = [elIDs, remClasses, addClasses]
    for (i=0; i<arguments.length; i++) {
        if (!arguments[i]) {
            args[i] = []
        }
        else if (typeof(arguments[i]) == 'string') {
            args[i] = [args[i]]
        }
    }

    for(i=0; i<elIDs.length;i++) {
        for (j=0;j<remClasses.length;j++) {
            document.getElementById(elIDs[i]).classList.remove(remClasses[j])
        }
        for(j=0;j<addClasses.length;j++) {
            document.getElementById(elIDs[i]).classList.add(addClasses[j])
        }
    }

    return 1
}

// Reveal a list of 'display-none' elements
// syntax: list element IDs ('',)
function show_element(/**/) {
    for (showI=0;showI<arguments.length;showI++) {
        document.getElementById(arguments[showI]).classList.remove('d-none')
    }
}
