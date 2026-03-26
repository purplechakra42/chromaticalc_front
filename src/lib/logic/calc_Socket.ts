import * as help from './calc_helpers'
import { recipesSockets } from './constants'
type Cost = [string, number]

const chances = Array(10).fill(0).map((_,i) => 0.5+i*0.05)
chances.push(0.99)

let blankStarts: Record<string,Cost[]> = {}
for (let r of recipesSockets) {
    if (![0, 1, recipesSockets.length-1].includes(r[0])) { 
        blankStarts[r[0]] = []
    }
}
let usesAndRerolls: Record<string, Record<string,Cost[]> > = {}
for (let c of chances) {
    if (![0, 1, recipesSockets.length-1].includes(c)) { 
        usesAndRerolls[c] = structuredClone(blankStarts)
    }
}

export function calculateUsesAndRerolls(): any {
    
    return 0
}