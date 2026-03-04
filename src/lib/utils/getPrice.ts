import { getDATA, getLEAGUES } from "$lib/context"
type Cost = [string, number]

export function getPrice({ costs, format="cd" }: {
        costs: [string, number][],
        format?: 'c' | 'd' | 'cd', // chaos, divines, or both (switching at 1d)
    }): [number, string] {
    let leagues = getLEAGUES()
    let costsAndItems = getDATA()

    // first page load
    if (!costsAndItems[leagues.currentLeagueID]) return [0,'c']

    // filter out 0 value costs
    costs = costs.filter(cost => cost[1] > 0)

    // check if all the data is in the api results
    let processedIn = []
    for (let cost of costs) {
        let found = costsAndItems[leagues.currentLeagueID]?.items.find(testItem => (testItem.id == cost[0] || testItem.name == cost[0]))
        if (found) {
            let price = costsAndItems[leagues.currentLeagueID].lines.find(testItem => testItem.id == found.id)
            if (price) {
                processedIn.push(cost[1] * price.primaryValue)
            } else {
                // price currently not available from api (due to lack of data)
                console.error(`Price for ${found} not loaded from API! (likely not enough trade volume)`)
                return [0,'c']
            }
        } else {
            // item not found in api results (likely just spelled wrong)
            console.error(`Name ${cost[0]} doesn't exist! (check spelling)`)
            return [0,'c']
        }
    }
    
    // calc and return the price
    let costChaos = processedIn.reduce((acc:number, cur) => cur ? acc+cur : acc, 0)
    let divineRatio = costsAndItems[leagues.currentLeagueID]?.core.rates.divine // inverse of divine cost
    
    if ((format== 'cd' && costChaos*divineRatio > 1) || (format == 'd')) {
        return [costChaos*divineRatio, 'divine']
    } else {
        return [costChaos, 'chaos']
    }
}
