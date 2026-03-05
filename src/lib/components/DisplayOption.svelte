<script lang="ts">
    import Icon from "./Icon.svelte";
    import IconPriced from "./IconPriced.svelte";
    import IconCosts from "./IconCosts.svelte";
    import InlineRGB from "./InlineRGB.svelte";

    import { getLEAGUES } from "$lib/context";
    let leagues = getLEAGUES()

    let { basepic, modifier='', text='', rgb, costs, vaal=false, unavailable=false, strong=false, onclick}: {
        basepic: string,
        modifier?: string,
        text?: string,
        rgb?: number[],
        costs: [string,number][],
        vaal?: boolean, // if the recipe requires vaal orbs
        unavailable?: boolean, // to show options that require the item to be corrupted
        strong?: boolean, // to bold the main line
        onclick?: ()=>void,
    } = $props()
    
    let corruptedFormatting = $derived([
        (vaal||unavailable) ? "border-red-900" : "border-dark-800",
        unavailable && "opacity-50"
    ].filter(Boolean).join(" "))
</script>

<button class="w-full flex flex-col md:flex-row gap-1 md:gap-[1ch] p-[1ch] items-center rounded-lg border {corruptedFormatting} bg-dark-900 text-white {onclick ? "cursor-pointer" : ""}" {onclick} >
    {#if !modifier && !vaal}
        <Icon itemIdentifier={basepic} />
    {:else}
        <div class="relative inline-block flex-none">
            <Icon itemIdentifier={basepic} />
            <Icon itemIdentifier={vaal ? "vaal" : modifier} variant="modifier" />
        </div>
    {/if}
    
    {#if rgb}
        <InlineRGB {rgb} bold={true} printchrome={true} alignment="flexexpand" />
    {:else}
        <p class="flex-auto text-center md:text-left px-2 md:px-0 {strong ? "font-bold" : ""}">{@html text}</p>
    {/if}

    {#if JSON.stringify(costs) !== JSON.stringify([])}
        <span class="flex gap-[1ch]">
            <IconCosts {costs} />
            <p class="text-center text-dark-600">|</p>
            <IconPriced {costs} />
        </span>
    {/if}
</button>