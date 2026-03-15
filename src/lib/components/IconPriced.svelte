<script lang="ts">
    import { getPrice } from "$lib/utils/getPrice";
    import { formatCost } from "$lib/utils/formatCost";
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

        return formatCost(info[0], 4)
    })

    let loadingFormat = $derived(leagues.loading || info[0] == 0 ? "bg-linear-to-r from-dark-800 to-dark-900 rounded-full" : "")
</script>

<span class="flex gap-1">
    <!-- +.5 padding is for potential decimal separator -->
    <p class="flex-none text-right font-bold {loadingFormat}" style="width: {pad+.5}ch">{costFormatted}</p>
    <Icon itemIdentifier={info[1]} variant="inline" />
</span>