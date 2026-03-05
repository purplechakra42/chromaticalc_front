<script lang="ts">
    import Icon from "./Icon.svelte";
    import { getLEAGUES } from "$lib/context";
    let leagues = getLEAGUES()

    let { costs }: {
      costs: [string, number][],
    } = $props()

    let costsFiltered = $derived(costs.filter(cost => cost[1]>0))

    let loadingFormat = $derived(leagues.loading ? "bg-linear-to-r from-dark-800 to-dark-900 rounded-full w-14" : "")
</script>

<span class="flex justify-center">
    {#each costsFiltered as cost, i}
        <p class="pr-1 text-dark-600">{i>0 ? '+' : ''}</p>
        <p class="pr-1">{cost[1].toLocaleString(undefined,{maximumFractionDigits:1})}</p>
        <!-- <p class="pr-1 {loadingFormat}">{!leagues.loading ? cost[1].toFixed(1) : ""}</p> -->
        <Icon itemIdentifier={cost[0]} variant='inline' />
    {/each}
</span>