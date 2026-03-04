interface NinjaPrice {
    id: string
    primaryValue: number
    volumePrimaryValue: number
    maxVolumeCurrency: string
    maxVolumeRate: number
    sparkline: {
        totalChange: number
        data: number[]
    }
}
interface NinjaItem {
    id: string
    name: string
    image: string
    category: string
    detailsID: string
}
interface NinjaCore {
    items: NinjaItem[]
    rates: {
        divine: number
    }
    primary: string
    secondary: string
}
export interface NinjaResponse {
    core: NinjaCore
    lines: NinjaPrice[] // prices
    items: NinjaItem[]
}

export const fetchNinja = async (currentLeagueID: string) => {
    const arrTypes = ["Currency", "Omen"]

    const arrRes = await Promise.all(
        arrTypes.map(type => fetch(`https://poe.ninja/poe1/api/economy/exchange/current/overview?league=${currentLeagueID}&type=${type}`))
    )

    for (let [i, res] of arrRes.entries()) {
        if (!res.ok) {
            throw new Error(`Ninja ${arrTypes[i]} API (response status: ${res.status})`)
        }
    }

    const arrInfo: NinjaResponse[] = await Promise.all(
        arrRes.map(res => res.json())
    )

    const costsAndItems: NinjaResponse = {
        core: arrInfo[0].core,
        lines: arrInfo.flatMap(info => info.lines),
        items: arrInfo.flatMap(info => info.items),
    }

    return costsAndItems
}