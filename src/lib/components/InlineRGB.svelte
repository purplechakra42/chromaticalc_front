<script lang="ts">
    let { rgb, printchrome=false, coloured=true, alignment="regular", bold=false }: { 
        rgb: number[],
        printchrome?: boolean,
        coloured?: boolean,
        alignment?: "regular" | "centered" | "flexexpand",
        bold?: boolean,
    } = $props()

    let alignmentStyle = $derived({
        regular: "",
        centered: "mx-auto",
        flexexpand: "flex-auto",
    }[alignment])
</script>

<span class="inline-flex {alignmentStyle} {bold?"font-bold":""} px-[0.5ch] text-white">
    {#if rgb.every(col => !col) && printchrome}
        <p class={coloured?"text-gray-200":""}>Chromatic (No Bench)</p>
    {:else}
        {#if rgb[0]}
            <p class={coloured?"text-red-200":""}>{rgb[0]}R</p>
        {/if}
        {#if rgb[1]}
            <p class={coloured?"text-green-200":""}>{rgb[1]}G</p>
        {/if}
        {#if rgb[2]}
            <p class={coloured?"text-blue-200":""}>{rgb[2]}B</p>
        {/if}
    {/if}
</span>