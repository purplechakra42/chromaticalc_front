import { requirementsToChances } from "./calc_Chromati"

export class Requirements {
    strRaw = $state<number|null>(null)
    dexRaw = $state<number|null>(null)
    intRaw = $state<number|null>(null)

    constructor(str:number|null=null, dex:number|null=null, int:number|null=null) {
        this.strRaw = str
        this.dexRaw = dex
        this.intRaw = int
    }

    reset() {
        this.strRaw = null
        this.dexRaw = null
        this.intRaw = null
    }

    #allzero = $derived<boolean>(!this.strRaw && !this.dexRaw && !this.intRaw)
    get all() { return [this.str, this.dex, this.int]}
    get str() { return this.#allzero ? 1 : this.strRaw ?? 0 }
    get dex() { return this.#allzero ? 1 : this.dexRaw ?? 0 }
    get int() { return this.#allzero ? 1 : this.intRaw ?? 0 }

    get allProb() { return requirementsToChances([this.str, this.dex, this.int]) }
    get strProb() { return this.allProb[0] }
    get dexProb() { return this.allProb[1] }
    get intProb() { return this.allProb[2] }
}

export const requirements = new Requirements()