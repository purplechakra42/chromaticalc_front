<script lang="ts">
	import Icon from "$lib/components/Icon.svelte";
  import { pages } from "$lib/pages";
</script>

<svelte:head>
  <title>Path of Calc</title>
  <link rel="icon" href="/logo.png" />
</svelte:head>

<div class="grid md:grid-cols-2 grid-cols-1 items-center gap-x-20 md:gap-y-10 gap-y-4 py-20 md:w-6/10 w-9/10 mx-auto md:text-base text-lg">
  <div class="md:col-span-2">
    <h1 class="text-5xl text-center font-bold pb-4">Path of Calc.</h1>
    <p class="text-lg text-center">A collection of tools and calculators for Path of Exile 1.</p>
  </div>
  {#each pages as page}
    <a class="flex flex-col gap-y-2 items-center border rounded-4xl border-fuchsia-200 bg-slate-800 p-2" href={page.href}>
      <span class="flex gap-x-[1ch]">
        <p class="text-3xl font-bold">{page.name}</p>
        <Icon itemIdentifier={page.icon} variant="inline_3xl"/>
      </span>
      <p class="w-9/10 text-center">{page.descriptor}</p>
    </a>
  {/each}
</div>