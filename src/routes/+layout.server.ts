import { fetchLeagues } from "$lib/utils/fetchLeagues"

export const load = async () => {
    const leagues = await fetchLeagues()
    const currentLeagueID = leagues.length > 8 ? leagues[8].id : leagues[0].id // choose League unless it's merge, then choose Standard

    return { leagues, currentLeagueID }
}