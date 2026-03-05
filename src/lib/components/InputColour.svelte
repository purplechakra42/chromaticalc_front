<script lang="ts">
    let { colour, name, placeholder=null, value=$bindable(), min="0", max=null }: {
        colour: "red" | "green" | "blue" | "black" | "white",
        name: string,
        placeholder?: string|null,
        value: number|null, // bindable can cause issues with debugging and interfacing if it's too deep - use callback functions for more than 1 level
        min?: string,
        max?: string|null,
    } = $props()

    const colourVariants: Record<string, string> = {
        red: "bg-red-200 border-red-600 text-dark-950",
        green: "bg-green-200 border-green-600 text-dark-950",
        blue: "bg-blue-200 border-blue-600 text-dark-950",
        black: "bg-dark-950 border-dark-400 text-dark-300",
        white: "bg-dark-200 border-dark-700 text-dark-950",
    };
    const hideSpinners = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
</script>

<input class="w-full border rounded-md {colourVariants[colour]} font-bold text-center {hideSpinners}" type="number" bind:value {name} min={min} max={max} placeholder={placeholder ?? name} />