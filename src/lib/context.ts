import { setContext, getContext } from "svelte";
import type { League } from "$lib/utils/fetchLeagues"
import type { NinjaResponse } from "$lib/utils/fetchNinja";

const LEAGUES = "LEAGUES"
const DATA = "DATA"

export function setLEAGUES(leagues: {leagues: League[], currentLeagueID: string, infoLeague: string, loading: boolean}) {
    setContext(LEAGUES, leagues)
}
export function getLEAGUES(): {leagues: League[], currentLeagueID: string, infoLeague: string, loading: boolean} {
    return getContext(LEAGUES)
}
export function setDATA(data: Record<string, NinjaResponse>) {
    setContext(DATA, data)
}
export function getDATA(): Record<string, NinjaResponse> {
    return getContext(DATA)
}