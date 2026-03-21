<script lang="ts">
	import './layout.css'
	
	import { page } from '$app/state'
	import { setLEAGUES, setDATA } from "$lib/context"
	import type { NinjaResponse } from "$lib/utils/fetchNinja"

	import IconPricedRatio from '$lib/components/IconPricedRatio.svelte';
	import NavBarElement from '$lib/components/NavBarElement.svelte';

	import { colours } from '$lib/logic/colours.svelte.js';
	import { requirements } from '$lib/logic/requirements.svelte';
	import { corrupted } from '$lib/logic/corrupted.svelte.js';
	function resetChromatiCalc() {
		if (page.url.pathname == '/chromaticalc') {
			requirements.reset()
			colours.reset()
			corrupted.corrupted = false
		}
	}
	
	let { data, children } = $props();

	// svelte-ignore state_referenced_locally
	let leagues = $state(data.leagues)
	// svelte-ignore state_referenced_locally
	let currentLeagueID = $state(data.currentLeagueID)
	// svelte-ignore state_referenced_locally
	const infoLeague = $state(data.currentLeagueID) // snapshot using state, used for icon 'cache'
	let pricesAndItems: Record<string, NinjaResponse> = $state({})
	let loadingPrices = $state(false)

	// get says: when you READ this property, actually run this FUNCTION and return that
	// set says: when you do L = setLEAGUES(); L.currentLeagueID = Standard; actually update the original currentleagueid which is reactive
	setLEAGUES({
		get leagues() { return leagues },
		get currentLeagueID() { return currentLeagueID },
		set currentLeagueID(id) { currentLeagueID = id },
		get infoLeague() { return infoLeague },
		get loading() { return loadingPrices }
	})
	setDATA(pricesAndItems)

	$effect(() => { // runs when pricesanditems or currentleagueid changes
		if (pricesAndItems[currentLeagueID]) {
			return
		}
		loadingPrices = true
        fetch(`/api/ninja?league=${currentLeagueID}`)
		.then(res => res.json()) // we have created our own endpoint which returns a RESPONSE, we're not using fetchNinja which returns actual info
		.then(data => {
            pricesAndItems[currentLeagueID] = data
        })
		.catch(error => {
			console.error('ninja fetch error:', error)
		})
		.finally(() => {
			loadingPrices = false
		})
	})

	let leaguesTrade = $derived(leagues.filter(
      (league: any) => league.rules.every(
      (rule: any) => !["NoParties", "HardMode"].includes(rule.id)) // we don't want SSF or Ruthless modes
    ))
	
	import { pages } from '$lib/pages.js';
	let showcurrencies = $state(false)
	
</script>

<div id="content" class="min-h-screen bg-dark-950 text-white flex">
	<nav class="hidden md:flex flex-col fixed inset-y-0 left-0 w-16 border-r border-dark-800 bg-dark-900 p-2 gap-2 justify-start-safe items-center">
		{#each pages as page}
			{#if page.name == 'ChromatiCalc'}
				<NavBarElement href={page.href} icon={page.icon} onclick={() => resetChromatiCalc()} />
			{:else}
				<NavBarElement href={page.href} icon={page.icon} />
			{/if}
		{/each}
	</nav>
	<main class="flex-1 flex flex-col md:ml-16">
		<header class="flex-none p-2 min-w-full bg-dark-800 border-b border-dark-700 flex justify-end items-center gap-4">
			<select bind:value={currentLeagueID} class="p-1.75 rounded-lg border border-dark-700 hover:bg-dark-700 hover:border-dark-600" aria-label="Select League">
				{#each leaguesTrade as league}
					<option value={league.id}>{league.name}</option>
				{/each}
			</select>
			<div class="rounded-lg border border-dark-700 hover:bg-dark-700 hover:border-dark-600" role="status" onmouseenter={() => showcurrencies=true} onmouseleave={() => showcurrencies=false}>
				<IconPricedRatio left="divine"/>
			</div>
			{#if showcurrencies}
				<div class="absolute top-12 rounded-lg border bg-dark-800 border-dark-700 z-10">
					{#each pages.find((pg) => pg.href == page.url.pathname)?.displayCurrencies as curr}
						<IconPricedRatio left={curr}/>
					{/each}
				</div>
			{/if}
		</header>
		{@render children()}
		<footer class="mt-auto flex-none py-2">
			<p class="text-dark-700 text-center">This product isn't affiliated with or endorsed by Grinding Gear Games in any way.</p>
		</footer>
	</main>
</div>