interface Rule {
    id: string
    name: string
    description: string
}
export interface League {
    id: string
    name: string
    realm: string
    url: string
    startAt: string
    endAt: string|null
    description: string
    category: {
        id: string
    }
    registerAt: string
    delveEvent: boolean
    rules: Rule[]
}

export const fetchLeagues = async () => {
    const leaguesRes = await fetch("https://api.pathofexile.com/leagues", {headers: {
        "User-Agent": "chromaticalc (contact: purplechakra on Discord)",
    }})

    if (!leaguesRes.ok) {
        throw new Error(`Official Leagues API (response status: ${leaguesRes.status})`)
    }

    const leagues: League[] = await leaguesRes.json()

    return leagues
}