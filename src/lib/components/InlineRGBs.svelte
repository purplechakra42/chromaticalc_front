<script lang="ts">
	import InlineRGB from "./InlineRGB.svelte";

    let { rgbs, printchrome=false, coloured=true, alignment="regular", bold=false }: { 
        rgbs: number[][],
        printchrome?: boolean,
        coloured?: boolean,
        alignment?: "regular" | "centered" | "flexexpand",
        bold?: boolean
    } = $props()
</script>

{#each rgbs as rgb, j}
    <InlineRGB {rgb} {printchrome} {coloured} {alignment} {bold} />
    {#if j+1 < rgbs.length}
        <p>or</p>
    {/if}
{/each}