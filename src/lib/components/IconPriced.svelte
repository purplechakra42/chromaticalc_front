<script lang="ts">
    import { getPrice } from "$lib/utils/getPrice";
    import { getLEAGUES } from "$lib/context";
    let leagues = getLEAGUES()
    import Icon from "./Icon.svelte";

    let { costs, format="cd", pad=4 }: {
      costs: [string, number][],
      format?: 'c' | 'd' | 'cd', // chaos, divines, or both (switching at 1d)
      pad?: number,
    } = $props()

    let info = $derived(getPrice({ costs, format })) // price, format (c/d)
    let costFormatted = $derived.by(() => { // coerce cost to be PAD or less characters
        if (leagues.loading || info[0] == 0) return "" // if loading OR the ninja api doesn't have prices for what we need

        let costLength = info[0].toFixed().length
        if (costLength >= pad+1) {
            return `${(info[0]/1000).toFixed()}k`
        } else if (costLength == pad) {
            return `${info[0].toFixed()}`
        } else {
            return `${info[0].toFixed(1)}`
        }
    })

    let loadingFormat = $derived(leagues.loading || info[0] == 0 ? "bg-linear-to-r from-gray-700 to-gray-800 rounded-full" : "")
</script>

<span class="flex gap-1">
    <!-- +.5 padding is for potential decimal separator -->
    <p class="flex-none text-right font-bold {loadingFormat}" style="width: {pad+.5}ch">{costFormatted}</p>
    <Icon itemIdentifier={info[1]} variant="inline" />
</span>