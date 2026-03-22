<script lang="ts">
    import { getDATA, getLEAGUES } from "$lib/context"
    let leagues = getLEAGUES()
    let costsAndItems = getDATA()
    
    let { itemIdentifier, variant="base" }: {
        itemIdentifier: string,
        variant?: "base" | "modifier" | "nav_inactive" | "nav_active" | "inline" | "inline_3xl",
    } = $props()
    
    let variantStyling = $derived({
        base: "h-11 w-11 flex-none",
        modifier: "h-6 w-6 absolute right-0 bottom-0 flex-none",
        nav_inactive: "h-12 w-12 border rounded-full p-1 border-dark-700 bg-dark-800 flex-none",
        nav_active: "h-12 w-12 border rounded-full p-1 border-blue-200 bg-slate-800 flex-none",
        inline: "h-7 w-7 inline-block flex-none",
        inline_3xl: "h-10 w-10 inline-block flex-none",
    }[variant])

    let infoleague = leagues.infoLeague
    let itemInfo = $derived(infoleague ? costsAndItems[infoleague]?.items.find(elem => (elem.id == itemIdentifier || elem.name == itemIdentifier)) : undefined)
</script>

{#if !leagues.loading && itemInfo}
    <img class="{variantStyling}" src={`https://web.poecdn.com${itemInfo?.image}`} alt={`${itemInfo.name}${variant=="modifier" ? " (Modifier)" : ""}`} />
{:else}
    <div class="{variantStyling} bg-linear-to-r from-dark-800 to-dark-900 rounded-full"></div>
{/if}