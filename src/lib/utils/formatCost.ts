export function formatCost(cost: number, pad: number): string {
    let costLength = cost.toFixed().length

    if (costLength >= pad+1) {
        return `${(cost/1000).toFixed()}k`
    } else if (costLength == pad) {
        return `${cost.toFixed()}`
    } else {
        return `${cost.toFixed(1)}`
    }
}