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
// syntax: element IDs, 1 (fade in) or 0 (fade out), duration (if you'd like to do the other afterwards) minimum one second,
// be sure not to call the function again until the animation duration (plus one second) is over!
// Checkpoint: need to make it so you can animate a set of elements at once, doing it one at a time just doesn't work.
function animate_fade(elements, type, duration) {

    if (typeof(elements) == 'string') {
        elements = [elements]
    }

    types = ['animate__fadeOut', 'animate__fadeIn']

    if (duration < 1000) {
        duration = 1000
    }

    if (typeof(elements) == 'string') {
        elements = [elements]
    }
    // for all elements, remove the other fade effect, apply the correct one, and reveal
    for (afi=0;afi<elements.length;afi++) {
        change_class(elements[afi], [types[(type+1)%2], 'd-none'], types[type])
    }
    if (duration) {
        setTimeout(() => {
            for (afi=0;afi<elements.length;afi++) {
                change_class(elements[afi], types[type], types[(type+1)%2])
            }
        }, duration)

        setTimeout(() => {
            for (afi=0;afi<elements.length;afi++) {
                change_class(elements[afi], types[(type+1)%2])
                if (type) {
                    hide_element(elements[afi])
                }
            }
        }, duration + 1000)
    }
}

// change the inner HTML of a list of elements
// syntax: a list of element IDs and a string of HTML
function change_html(elIDs, newHTML) {
    if (typeof(elIDs) == 'string') {
        elIDs = [elIDs]
    }

    for (chi=0;chi<elIDs.length;chi++) {
        document.getElementById(elIDs[chi]).innerHTML = newHTML
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
    if (typeof(arguments[0]) == 'object') {
        hideArgs = arguments[0]
    }
    else {
        hideArgs = arguments
    }
    for (hideI=0;hideI<hideArgs.length;hideI++) {
        document.getElementById(hideArgs[hideI]).classList.add('d-none')
    }
}

// Add and remove classes from an element/elements
// syntax: an element's ID, an array of classes to remove, and an array of classes to add ('', [], [])
function change_class(/**/) {
    args = []
    for (cci=0; cci<3; cci++) {
        if (!arguments[cci]) {
            args[cci] = []
        }
        else if (typeof(arguments[cci]) == 'string') {
            args[cci] = [arguments[cci]]
        }
        else {
            args[cci] = arguments[cci]
        }
    }

    for(cci=0; cci<args[0].length;cci++) {
        for (ccj=0;ccj<args[1].length;ccj++) {
            document.getElementById(args[0][cci]).classList.remove(args[1][ccj])
        }
        for(ccj=0;ccj<args[2].length;ccj++) {
            document.getElementById(args[0][cci]).classList.add(args[2][ccj])
        }
    }

    return 1
}

// create a list of sequential IDs
function id_list(name, length) {
    list = []
    for (ili=0;ili<length;ili++) {
        list[ili] = name + ili
    }
    return list
}

// Reveal a list of 'display-none' elements
// syntax: list element IDs ('',)
function show_element(/**/) {
    if (typeof(arguments[0]) == 'object') {
        showArgs = arguments[0]
    }
    else {
        showArgs = arguments
    }
    for (showI=0;showI<showArgs.length;showI++) {
        document.getElementById(showArgs[showI]).classList.remove('d-none')
    }
}

// make a set of a repeated element
function make_homogenous_set(item, length) {
    set = []
    for (mhsi=0;mhsi<length;mhsi++) {
        set[mhsi] = item
    }
    return set
}

// compare two arrays and return TRUE if they're the same
function compare_array(array1, array2) {
    if (array1.length != array2.length) {
        return false
    }
    for (cai=0;cai<array1.length;cai++) {
        if(array1[cai] != array2[cai]) {
            return false
        }
    }
    return true
}
