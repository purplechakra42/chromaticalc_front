<script lang="ts">
    import { getPrice } from "$lib/utils/getPrice";
    import { formatCost } from "$lib/utils/formatCost";
    import { getLEAGUES } from "$lib/context";
    let leagues = getLEAGUES()

	import Icon from '$lib/components/Icon.svelte';
	import IconPriced from '$lib/components/IconPriced.svelte';

    let { left, right="c" }: {
        left: string, // currency to show on the left of the ratio
        right?: 'c' | 'd' | 'cd', // chaos, divines, or both (switching at 1d)
    } = $props()

    let price = $derived(getPrice({costs: [[left, 1]], format: right}))
</script>

<span class="flex px-[1ch] py-1 gap-1">
    <Icon itemIdentifier={left} variant="inline" />

    {#if !leagues.loading && price[0] !== 0}
        {#if price[0] > 1}
            <p class="font-bold">1</p>
        {:else}
            <p class="font-bold w-[4.5ch]">{formatCost(1/price[0], 4)}</p>
        {/if}

        <!-- <p>:</p> -->
        <p>=</p>

        {#if price[0] > 1}
            <IconPriced costs={[[left, 1]]} format={right} />
        {:else}
            <p class="font-bold">1</p>
            <Icon itemIdentifier={right=='c'?'chaos':'divine'} variant="inline" />
            <!-- <IconPriced costs={[[left, 1/price[0]]]} format={right} pad={1} /> -->
        {/if}
    {:else}
        <p>:</p>
        <Icon itemIdentifier={right=='c'?'chaos':'divine'} variant="inline" />
    {/if}
</span>