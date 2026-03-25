<script lang="ts">
	import Icon from "$lib/components/Icon.svelte";
  import { pages } from "$lib/pages";
</script>

<svelte:head>
  <title>Path of Calc</title>
  <link rel="icon" href="/logo2.png" />
</svelte:head>

<div class="grid md:grid-cols-2 grid-cols-1 items-center gap-x-10 w-full md:gap-y-9 gap-y-4 mx-auto md:text-base text-lg">
  <span class="md:col-span-2">
    <h1 class="text-5xl text-center font-bold pb-4">Path of Calc.</h1>
    <h2 class="text-xl text-center">A collection of tools and calculators for Path of Exile 1.</h2>
  </span>
  {#each pages as page}
    <a class="flex flex-col gap-y-2 items-center border-y rounded-4xl border-blue-200 bg-slate-800 p-4" href={page.href}>
      <span class="flex gap-x-[1ch]">
        <p class="md:text-3xl text-3xl font-bold text-blue-100">{page.name}</p>
        <Icon itemIdentifier={page.icon} variant="inline_3xl"/>
      </span>
      <p class="w-9/10 text-center text-dark-100">{page.descriptor}</p>
    </a>
  {/each}
  <div class="flex flex-col gap-y-2 items-center border-y rounded-4xl text-dark-400 border-slate-700 bg-dark-950 p-4">
    <p class="text-xl font-bold">and more!</p>
    <p class="w-9/10 text-base text-center">(under construction)</p>
  </div>
</div>