import type { Colours } from "$lib/logic/colours.svelte";
import type { Requirements } from "$lib/logic/requirements.svelte";

export function encodeParams(colours: Colours, requirements: Requirements, corrupted: boolean): string {
    let params = ''

    let paramsRequirements = [requirements.strRaw, requirements.dexRaw, requirements.intRaw]
    params += paramsRequirements.map((req, i) => req ? 'sdi'[i] + req : '').join('')

    let paramsColour = [colours.rRaw, colours.gRaw, colours.bRaw, colours.uRaw, colours.wRaw]
    params += paramsColour.map((col, i) => col ? 'rgbuw'[i] + col : '').join('')

    params += corrupted ? 'v' : ''

    return params
}

export function decodeParams(params: string) {
    if (!params) return
    
    return {
        strRaw: Number(params.match(/s(\d+)/)?.[1]) || null,
        dexRaw: Number(params.match(/d(\d+)/)?.[1]) || null,
        intRaw: Number(params.match(/i(\d+)/)?.[1]) || null,
        rRaw: Number(params.match(/r(\d+)/)?.[1]) || null,
        gRaw: Number(params.match(/g(\d+)/)?.[1]) || null,
        bRaw: Number(params.match(/b(\d+)/)?.[1]) || null,
        uRaw: Number(params.match(/u(\d+)/)?.[1]) || null,
        wRaw: Number(params.match(/w(\d+)/)?.[1]) || null,
        corrupted: params.match(/v/) ? true : false
    }
}