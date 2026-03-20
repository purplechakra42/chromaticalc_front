export class Colours {
    rRaw=$state<number|null>(null)
    gRaw=$state<number|null>(null)
    bRaw=$state<number|null>(null)
    uRaw=$state<number|null>(null)
    wRaw=$state<number|null>(null)

    get r() { return this.rRaw??0 }
    get g() { return this.gRaw??0 }
    get b() { return this.bRaw??0 }
    get u() { return this.uRaw??0 }
    get w() { return this.wRaw??0 }

    constructor(r:number|null=null, g:number|null=null, b:number|null=null, u:number|null=null, w:number|null=null, ) {
        this.rRaw = r
        this.gRaw = g
        this.bRaw = b
        this.uRaw = u
        this.wRaw = w
    }

    reset() {
        this.rRaw = null
        this.gRaw = null
        this.bRaw = null
        this.uRaw = null
        this.wRaw = null
    }

    get rgb() { return [this.r??0, this.g??0, this.b??0] }
    get rgbu() { return [this.r??0, this.g??0, this.b??0, this.u??0] }
    get rgbw() { return [this.r??0, this.g??0, this.b??0, this.w??0] }
    get rgbuw() { return [this.r??0, this.g??0, this.b??0, this.u??0, this.w??0] }

    get total(): number { return (this.r??0)+(this.g??0)+(this.b??0)+(this.u??0)+(this.w??0) }
    get totalFixed(): number { return this.total-(this.u??0) }
}

export const colours = new Colours()