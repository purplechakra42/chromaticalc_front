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
        red: "border-red-800 text-dark-950 from-red-200 via-red-100 to-red-200",
        green: "border-green-800 text-dark-950 from-green-200 via-green-100 to-green-200",
        blue: "border-blue-800 text-dark-950 from-blue-200 via-blue-100 to-blue-200",
        black: "border-dark-400 text-dark-300 from-dark-950 via-dark-900 to-dark-950",
        white: "border-dark-800 text-dark-950 from-dark-300 via-dark-100 to-dark-300",
    };
    const hideSpinners = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
</script>

<input class="w-full border-y rounded-xl {"bg-linear-to-r from-0% via-[percentage:10%_90%] to-100% " + colourVariants[colour]} font-bold text-center {hideSpinners}" type="number" bind:value {name} min={min} max={max} placeholder={placeholder ?? name} />