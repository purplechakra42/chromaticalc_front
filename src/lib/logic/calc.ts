import type { Colours } from './colours.svelte';
import { MAX_SOCKETS, recipesChromes, recipesSockets, MIN_OFF_COLOUR_CHANCE, MAGIC_PARAM_1, MAGIC_PARAM_2, blanchingOdds } from './constants';
import { oneSocketJumpInformation, nSocketJumpInformation } from "./constants"
import type { Requirements } from './requirements.svelte';
// for code
let f = [1, 1] // factorial memoisation

export function testfun(colours:any): number[] {
    return colours.rgb
}

/**
 * Checks whether there is enough data to calculate colouring costs.
 */
export function checkAllRequirements(colours: Colours, requirements: Requirements): string {
    try {
        if (colours.r < 0 || colours.g < 0 || colours.b < 0 || colours.u < 0) {
            throw new Error(`Fixed socket value too low! Input had ${arrayToRGB(colours.rgb)} fixed sockets with ${colours.u} unfixed.`)
        }
        if (requirements.str < 0 || requirements.dex < 0 || requirements.int < 0) {
            throw new Error(`Stat requirement too low! Input had ${requirements.str}, ${requirements.dex} ${requirements.int} requirements.`)
        }
        if (colours.totalFixed == 0) {
            throw new Error(`Input had 0 fixed sockets!`)
        }
        if (colours.total > MAX_SOCKETS) {
            throw new Error(`Too many sockets to roll! Input had ${colours.total} total rolled sockets.`)
        }
    
        if (requirements.str > 0 && requirements.dex > 0 && requirements.int > 0 && (requirements.str !== requirements.dex || requirements.dex !== requirements.int || requirements.int !== requirements.str)) {
            throw new Error(`Socket colour formula is unknown for items with 3 non-zero, non-identical requirements!\nTesting can be done on Akoya's Gaze or The Golden Charlatan.`)
        }
    } catch (error) {
        // console.log(error)
        return error as string
    }

    return "Ready"
}

/**
 * Calculates the cost for each viable chromatic orb benchcraft.
 */
export function calculateColoursBench(colours: Colours, requirements: Requirements): [number, number[], number][] {
    let out: [number, number[], number][] = []

    for (const [i, recipe] of recipesChromes.entries()) {
        const remainingSockets = subtractTwoArrays(colours.rgb, recipe.slice(0,3))
        if (remainingSockets.every(n => n>=0)) { // if the recipe can give a desired output
            let probability = multinomialWithUnfixedSockets(colours.u, remainingSockets, requirements.allProb)
            probability /= i == 0 ? 1-calculateChromaticBonus(colours.total, colours.rgb, requirements.allProb) : 1 // adjust chromatic orb chances
            
            out.push([probability, recipe.slice(0,3), recipe[3]])
            // console.log(`${recipe[0]}R${recipe[1]}G${recipe[2]}B = ${(1/probability*recipe[3]).toFixed(1)} (${(100*probability).toFixed(5)}%)`)
        }
    }
    return out
}

export function calculateColoursJeweller(colours: Colours, requirements: Requirements): [JewellerTree[], number[][]] {
    let storedTrees: JewellerTree[] = []
    let storedStartingRecipes: number[][] = []

    for (const [i, recipe] of recipesChromes.entries()) {
        if (i==0) { continue } // to reduce complexity, manually chroming to start is not considered (if the jeweller method is cheaper, it's unlikely that your chrome odds are good anyway)
        const remainingSockets = subtractTwoArrays(colours.rgb, recipe.slice(0,3))
        if (remainingSockets.every(n => n>=0)) { // if the recipe can give a desired output
            let startingSockets = sumOfElements(recipe.slice(0,3))
            if (startingSockets >= 2) { // need to start with at least 2 sockets, because! we can't jump back down to 1
                const startingTree: JewellerTree = {
                    [startingSockets]: [{
                        state: recipe.slice(0,3),
                        probability: 1,
                        cost: recipesSockets[startingSockets][1], // jeweller cost to start (assume bench craft used)
                        nextStates: []
                    }]
                }
                const tree = generateJewellerTree(colours.rgb, requirements.allProb, startingSockets, startingTree)
                storedTrees.push(tree)
                storedStartingRecipes.push(recipe)
            }
        }
    }
    return [storedTrees, storedStartingRecipes]
}

export function calculateColoursTaintedChrome(colours: Colours): number {    
    // just regular chromes with equal colour weightingss
    let probability = multinomialWithUnfixedSockets(colours.u, colours.rgb, [1/3,1/3,1/3])
    probability /= 1-calculateChromaticBonus(colours.total, colours.rgb, [1/3,1/3,1/3])
    // console.log(`TCHROM = ${(1/probability).toFixed(1)} (${(100*probability).toFixed(5)}%)`)
    return probability
}

export function calculateColoursBlanching(colours: Colours, requirements: Requirements): number {
    let blanChance = 0
    // for each blanching option (1, 2, 3)
    for (let i = 0; i < blanchingOdds.length; i++) {
        if ( colours.w > i+1 ) { // if we need more white sockets than what we're getting this iteration
            continue // go next
        } else if ( colours.w == i+1 ) { // if we have the exact right number of whites
            blanChance += blanchingOdds[i] * multinomialWithUnfixedSockets(colours.u, colours.rgb, requirements.allProb)
        } else if ( colours.w < i+1 ) { // if we are getting more whites than we need
            // generate all combinations of which sockets the whites can replace
            let combinations = flattenCombinations(generateCombinations((i+1) - colours.w, 3))
            // calculate the odds to get each combination that can still give the desired result (e.g. don't generate odds for (2W)2R if we want 1R3G)
            for (let combination of combinations) {
                const remainingSockets = subtractTwoArrays(colours.rgb, combination.slice(0,3))
                if (remainingSockets.every(n => n>=0)) { // if the combination can give a desired output
                    // don't bother with the chromaticBonus - depending on how blanchings are implemented, the bonus might be diminished or even entirely absent, and I'd rather err on the side of caution
                    blanChance += blanchingOdds[i] * combination[3] * multinomialWithUnfixedSockets(colours.u, remainingSockets, requirements.allProb)
                }
            }
        }
    }
    return blanChance
}

// calculate the average number of crafts to get from Start white sockets to End if you have Total sockets available
export function calculateHarvestWhites(start: number, end: number, total: number): number {
    if (start >= end) {
        return 0
    }
    let c = 0
    while (start < end) {
        c += total/(total-start) // 1 divided by the cost to add a new white
        start++
    }
    return c
}
// calculate the number of blanchings required to get END whites on TOTAL sockets. if END is more than possible, return the number to get max white sockets
export function calculateBlanchingWhites(end: number, total: number): number {
    if (end > blanchingOdds.length) {
        return 1/blanchingOdds[blanchingOdds.length-1]
    } else {
        return 1/(sumOfElements(blanchingOdds.slice(end-1, blanchingOdds.length)))
    }
}

    // morrigan + shield crab 6s

    // tainted jewellers

    // morrigan + sand spitter 6l

    // tainted fusings

/**
 * Converts item stat requirements into socket colour chances.
 * @remarks
 * Full credit for the formulae and parameters goes to Siveran https://siveran.github.io/calc.html
 */
export function requirementsToChances(requirements: number[]): number[] {
    const sumOfRequirements = sumOfElements(requirements)
    const nonzeroRequirements = requirements.filter(req => req !== 0).length

    function requirementToChance(req: number): number {
        switch (nonzeroRequirements) {
            case 1: 
                return(req > 0
                    ? (1-MIN_OFF_COLOUR_CHANCE) * (req + MAGIC_PARAM_1+MAGIC_PARAM_2) / (sumOfRequirements + 3*MAGIC_PARAM_1+MAGIC_PARAM_2)
                    : MIN_OFF_COLOUR_CHANCE/2 + (1-MIN_OFF_COLOUR_CHANCE)*MAGIC_PARAM_1 / (sumOfRequirements + 3*MAGIC_PARAM_1+MAGIC_PARAM_2))
            case 2:
                return(req > 0
                    ? (1-MIN_OFF_COLOUR_CHANCE) * req / sumOfRequirements
                    : MIN_OFF_COLOUR_CHANCE)
            case 3:
                return(req / sumOfRequirements)

            default: throw Error(`I don't know how you got here. Had ${nonzeroRequirements} non-zero requirements, based on ${requirements}.`)
        }
    }
    return(requirements.map(req => requirementToChance(req))) // convert each stat requirement into the chance to roll its corresponding colour
}

interface JewellerState {
    /** Current socket state (R, G, B) */
    state: number[];
    /** Overall probability to reach this state */
    probability: number;
    /** Overal cost to reach this state */
    cost: number;
    /** List of socket states that can be reached from current state */
    nextStates: number[][];
}
export interface JewellerTree {
    /** Each socket count holds a list of all states that are possible */
    [socketCount: number]: JewellerState[]
}
// the jeweller method has some nuance.
// is it ever okay to go up by more than one socket at a time?
//   not if at least 2 sockets are fixed, because then it's cheaper to just do them one at a time (if the socket recipes didn't increase in cost so fast it might be okay).
//   as far as I can intuit/hand calculate, there aren't any exceptions with two fixed sockets (imagine 002 -> 222 and red/green have high odds, still not worth). I haven't done an exhaustive search though.
//   however, if only one of the sockets is fixed, there are probability thresholds where it's okay. stored in nSocketJumpInformation.
// is it ever okay to keep a more common colour to avoid the cost of rerolling for a rarer one?
//   yes, sometimes. look at the cost of rolling for the rarer one with the more expensive crafts, vs rerolling this one and then getting the more common one with the more expensive crafts
//   stored in oneSocketJumpInformation. hitting these ratios between the offcolour and one oncolour is only possible on Scourged items as of 3.27.
//   however, with two oncolours that have similar but non-identical stat requirements, these ratios are possible (some body armours, maybe some uniques (I assume akoya's and charlatan but odds 3 different reqs is untested))
// is it ever okay to keep a socket that we only want 1 of, if there's another colour we want 2 or more of?
//   as just calculated, if the 1 socket is rare enough, then no. 
//   I will test this with similar rarity sockets, but I suspect you always want to keep your options open due to the rapid cost scaling of socket crafts. 
function generateJewellerTree(fixedColours: number[], colourChances: number[], currentSocketNum: number, jewellerTree: JewellerTree): JewellerTree {
    // strategy: create a tree, where each node is a viable socket combination holding its overall probability to reach + the average cost to reach it
    // then, the final cost will be stored in the ending node, AND we can parse the tree to get the instructions to display
    if (currentSocketNum == MAX_SOCKETS || currentSocketNum == sumOfElements(fixedColours)) { // base case
        return jewellerTree
    }
    // recursive case
    jewellerTree[currentSocketNum+1] = []
    for (const startingState of jewellerTree[currentSocketNum]) {
        // generate all possible next states from this state
        let viableSockets = listViableSockets(subtractTwoArrays(fixedColours, startingState.state), colourChances, currentSocketNum)
        let viableChances = viableSockets.map((socket, j) => socket > 0 ? colourChances[j] : 0)
        let viableChancesSum = sumOfElements(viableChances)
        for (const [i, viable] of viableSockets.entries()) {
            if (viable > 0) {
                let newState = addValueToOneElement(startingState.state, viable, i) // add one to the current state to get the next state
                startingState.nextStates.push(newState)
                // add the next state as one of the next options in the tree, if it isn't already in there
                if (!jewellerTree[currentSocketNum+1].some(item => checkArrayEquality(item.state, newState))) {
                    jewellerTree[currentSocketNum+1].push({
                        state: newState,
                        probability: 0,
                        cost: 0,
                        nextStates: []
                    })
                }
                // then, for this next state: calculate normalised probability (i.e. the chance that, given we hit something we want, we hit THIS state)
                let normalisedProb = viableChances[i]/viableChancesSum
                // calculate the overall probability that we'll go from current to next state
                let probIncomingTEMP = startingState.probability * normalisedProb
                // calculate the cost of going to the next state from the current state
                // note that the whole thing is dependent on the cost to go from the previous to ANY next state (hence why viableChancesSum is used instead of the individual chance)
                //  - this is where the cost savings for having multiple options is encoded
                // the whole cost is then multiplied by the overall chance to enter into this state, to correctly weight for the average case
                // console.log(`${probIncomingTEMP} * (${startingState[2]} + (${recipesSockets[currentSocketNum][1]} + ${recipesSockets[currentSocketNum+1][1]}) * ${1/viableChancesSum})`)
                let costTEMP = probIncomingTEMP * (startingState.cost + (recipesSockets[currentSocketNum][1] + recipesSockets[currentSocketNum+1][1]) * 1/viableChancesSum)
                // add the contribution from the current > next state, into the next states' cost and incoming probability
                // console.log(probIncomingTEMP, costTEMP, '\n')
                for (let nextState of jewellerTree[currentSocketNum+1]) {
                    if (checkArrayEquality(nextState.state, newState)) {
                        nextState.probability += probIncomingTEMP
                        nextState.cost += costTEMP
                    }
                }
            }
        }
    }
    return generateJewellerTree(fixedColours, colourChances, currentSocketNum+1, jewellerTree)
}
function listViableSockets(fixedColours: number[], colourChances: number[], startingSockets: number): number[] {
    fixedColours = fixedColours.slice(0,3) // we only care about the fixed ones
    const remainingFixed = fixedColours.filter(value => value > 0).length
    colourChances = colourChances.map((chance, j) => fixedColours[j] > 0 ? chance : 99) // if we don't need any more of a colour, don't consider its chances
    let minThreshold = Math.min(...colourChances) // find the sockets we're okay to keep on this step, and then...
    minThreshold *= remainingFixed >= 2 ? oneSocketJumpInformation[startingSockets] : 1 // ...if we're doing more than one, we need to check if keeping a common one is better

    let viableSockets = [0,0,0]
    for (let [j, colour] of fixedColours.entries()) {
        if (colour > 0 && colourChances[j] <= minThreshold) {
            viableSockets[j] = colour // the count so that we can filter later
        } else {
            viableSockets[j] = 0 // if it's not within the min threshold, we know it's NEVER a good idea to get it on this step
            fixedColours[j] = 0 // make this 0 so that the next filtering step only cares about sockets that we are allowed to get
        }
    }
    // it's never a good idea to reduce our options. or is it... HEY VSAU- no really, is it NEVER a good idea? I think so, but
    // to test, filter out everything in viable sockets that would unecessarily reduce our chances of hitting SOMETHING we want next step
    for (let [j, colour] of viableSockets.entries()) {
        if (colour == 1 && Math.max(...fixedColours) >= 2) {
            viableSockets[j] = 0
        }
    }
    // make everything in viableSockets 1 or 0
    return viableSockets.map(colour => colour > 0 ? 1 : 0)
}
type InstructionState = number[]
export type Instruction = [string, InstructionState[]]
export function parseJewellerTree(tree: JewellerTree, colours: Colours): Instruction[] {
    let instructionList: Instruction[] = []
    let stateListTemp: InstructionState[] = []
    for (let [i, socknum] of Object.keys(tree).entries()) {
        // starting bench crafts
        if (i == 0) {
            instructionList.push([`Get <strong>${socknum} sockets</strong> (using the Bench Craft or Jeweller's Orbs)`, [[]]])
            instructionList.push([`Bench Craft`, [tree[Number(socknum)][0].state.slice(0,3)]])
        } else {
            for (let state of tree[Number(socknum)]) {
                stateListTemp.push(state.state.slice(0,3))
            }
            instructionList.push([`Reroll the ${socknum}${getOrdinalSuffix(parseInt(socknum))} socket until your colours are`, stateListTemp])
            stateListTemp = []
        }
    }
    if (colours.u > 0) {
        instructionList.push([`Use the ${colours.total} Socket Bench Craft`, [[]]])
    }
    return instructionList
}

function multinomialWithUnfixedSockets(unfixedSockets: number, fixedSockets: number[], colourChances: number[], orderingIndex = 0): number {
    if (unfixedSockets === 0) {
        return(multinomial(fixedSockets, colourChances))
    } else {
        // recurse into each possible option for the next unfixed socket. note:
        //   the multinomial function adjusts for different permutations of sockets (like RG and GR), so we need to avoid double counting (also it cuts down on branching)
        //   to do this, we give the colours an order, and say that you can't go backwards in that order
        //   example: we can add a red socket, then a green socket, but then we can't add a red socket again (because that would be RGR, and RRG is already handling it)
        return(
            (orderingIndex <= 0 ? multinomialWithUnfixedSockets(unfixedSockets-1, addValueToOneElement(fixedSockets, 1, 0), colourChances, 0) : 0)
            + (orderingIndex <= 1 ? multinomialWithUnfixedSockets(unfixedSockets-1, addValueToOneElement(fixedSockets, 1, 1), colourChances, 1) : 0)
            + multinomialWithUnfixedSockets(unfixedSockets-1, addValueToOneElement(fixedSockets, 1, 2), colourChances, 2)
        )
    }
}
// use the multinomial distribution formula to find the chance of getting exactly the fixed colours
function multinomial(fixedColours: number[], colourChances: number[]): number {
    let [red, green, blue] = fixedColours
    let [str, dex, int] = colourChances
    return factorial(red+green+blue)/(factorial(red) * factorial(green) * factorial(blue)) * Math.pow(str, red) * Math.pow(dex, green) * Math.pow(int, blue)
}

// similar to multinomialWithUnfixedSockets, but when we get to the base case, we find the likelihood that it gets rolled TWICE, not just rolled
// again, credit to Siveran for the logic here
function calculateChromaticBonus(unfixedSockets: number, fixedSockets: number[], colourChances: number[], currentSockets = [0, 0, 0], orderingIndex = 0): number {
    if (currentSockets.every((current, i) => current >= fixedSockets[i])) { // if we have rolled our desired colours, we're not going to roll it again
        return(0)
    }
    if (unfixedSockets === 0) {
        return(multinomialTwice(currentSockets, colourChances))
    } else {
        return(
            (orderingIndex <= 0 ? calculateChromaticBonus(unfixedSockets-1, fixedSockets, colourChances, addValueToOneElement(currentSockets, 1, 0), 0) : 0)
            + (orderingIndex <= 1 ? calculateChromaticBonus(unfixedSockets-1, fixedSockets, colourChances, addValueToOneElement(currentSockets, 1, 1), 1) : 0)
            + calculateChromaticBonus(unfixedSockets-1, fixedSockets, colourChances, addValueToOneElement(currentSockets, 1, 2), 2)
        )
    }
}
// calculates the chance to roll a combination, and then immediately roll it again
function multinomialTwice(currentSockets: number[], colourChances: number[]): number {
    let [red, green, blue] = currentSockets
    let [str, dex, int] = colourChances
    // this is just the multinomial distribution formula, but with the chance to roll the combination twice in a row instead of once (that's what the *2s are for)
    // since each permutation of the same combination has the same chance, we keep the adjustment coefficient in the multinomial
    return factorial(red+green+blue)/(factorial(red) * factorial(green) * factorial(blue)) * Math.pow(str, red*2) * Math.pow(dex, green*2) * Math.pow(int, blue*2)
}


function factorial(num: number): number {
    if (f[num] !== undefined) {
        return(f[num])
    } else {
        return(f[num] = num * factorial(num-1))
    }
}
export function arrayToRGB(array: number[]): string {
    if (checkArrayEquality(array, [0,0,0])) {
        return 'Chromatic (No Bench)'
    } else {
        return `${array[0] ? `${array[0]}R` : ""}${array[1] ? `${array[1]}G` : ""}${array[2] ? `${array[2]}B` : ""}`
    }
}
function generateCombinations(total: number, length: number): number[][] {
    // generate all possible combinations of Total choices spread out across Length options. will contain duplicates
    let out = []
    for (let i = 0; i < length; i++) {
        let tempout = constructSingleValueArray(1,i,length)
        if (total > 1) {
            for (const array of generateCombinations(total-1,length)) {
                out.push(addTwoArrays(tempout,array))
            }
        } else {
            out.push(tempout)
        }
    }
    return out
}
function flattenCombinations(combinations: number[][]): number[][] {
    // collect all duplicate combinations, and calculate its chances of appearing based on the number of duplicates
    const total = combinations.length
    let out: number[][] = []
    for (const combination of combinations) {
        if (!out.some(item => checkArrayEquality(item.slice(0,3), combination))) {
            out.push([...combination,0])
        }
        let idxOfComb = out.findIndex((item => checkArrayEquality(item.slice(0,3),combination)))
        out[idxOfComb][3] += 1/total
    }
    return out
}
function getOrdinalSuffix(num: number): string {
    switch (num) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
    }
    return 'th'
}
function nullToZero(array: (number | null)[]): number[] {
    return array.map(value => value ?? 0)
}
export function sumOfElements(array: number[]): number {
    return array.reduce((runningTotal,currentElement) => runningTotal + currentElement, 0)  
}
function addTwoArrays(base: number[], addor: number[]): number[] {
    if (base.length != addor.length) {
        throw Error('adding arrays with different lengths')
    }
    return base.map((num, idx) => num + addor[idx])
}
function subtractTwoArrays(base: number[], subtractor: number[]): number[] {
    if (base.length != subtractor.length) {
        throw Error('subtracting arrays with different lengths')
    }
    return base.map((num, idx) => num - subtractor[idx])
}
function constructSingleValueArray(value: number, index: number, length: number): number[] {
    let outArray = new Array(length)
    outArray.fill(0)
    outArray[index] = value
    return outArray
}
function addValueToOneElement(base: number[], value: number, index: number): number[] {
    return addTwoArrays(base, constructSingleValueArray(value, index, base.length))
}
function checkArrayEquality(arr1: number[], arr2: number[]): boolean {
    if (arr1.length != arr2.length) {
        throw Error('comparing arrays with different lengths')
    }
    for (let [i, element] of arr1.entries()) {
        if (element != arr2[i]) {
            return false
        }
    }
    return true
}