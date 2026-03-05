<script lang="ts">
	import './layout.css'

	import { setLEAGUES, getLEAGUES, setDATA, getDATA } from "$lib/context"
	import type { NinjaResponse } from "$lib/utils/fetchNinja"

	import NavBarElement from '$lib/components/NavBarElement.svelte';
	import IconPriced from '$lib/components/IconPriced.svelte';
	import Icon from '$lib/components/Icon.svelte';
	
	let { data, children } = $props();

	// svelte-ignore state_referenced_locally
	let leagues = $state(data.leagues)
	// svelte-ignore state_referenced_locally
	let currentLeagueID = $state(data.currentLeagueID)
	// svelte-ignore state_referenced_locally
	const infoLeague = $state(data.currentLeagueID) // snapshot using state, used for icon 'cache'
	let loadingPrices = $state(false)

	let pricesAndItems = $state<Record<string, NinjaResponse>>({}) // better typing than "let pricesAndItems: Record<string, NinjaResponse> = $state({})"

	// get says: when you READ this property, actually run this FUNCTION and return that
	// set says: when you do L = setLEAGUES(); L.currentLeagueID = Standard; actually update the original currentleagueid which is reactive
	setLEAGUES({
		get leagues() { return leagues },
		get currentLeagueID() { return currentLeagueID },
		set currentLeagueID(id) { currentLeagueID = id },
		get infoLeague() { return infoLeague },
		get loading() { return loadingPrices }
	})
	// setLEAGUES({leagues: leagues, currentLeagueID: currentLeagueID})
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
	
	let pages: Record<string, string> = {
		"chromaticalc": "Chromatic Orb",
		// "socketcalc": "Orb of Fusing",
		// "conflictcalc": "Orb of Conflict",
		// "cooldowncalc": "Awakened Cast on Critical Strike Support",
		// "adornedcalc" : "The Adorned",
		// "weightcalc" : "Albino Rhoa Feather",
	}
</script>

<div id="content" class="min-h-screen bg-dark-950 text-white flex">
	<nav class="hidden md:flex flex-col fixed inset-y-0 left-0 w-16 border-r border-dark-800 bg-dark-900 p-2 gap-2 justify-start-safe items-center">
		{#each Object.keys(pages) as page}
			<NavBarElement href={page} icon={pages[page]}/>
		{/each}
	</nav>
	<main class="flex-1 flex flex-col md:ml-16">
		<header class="flex-none p-2 min-w-full bg-dark-800 border-b border-dark-700 flex justify-end items-center gap-4">
			<select bind:value={currentLeagueID} class="p-1.75 rounded-lg border border-dark-700 hover:bg-dark-700 hover:border-dark-600" aria-label="Select League">
				{#each leaguesTrade as league}
					<option value={league.id}>{league.name}</option>
				{/each}
			</select>
			<span class="flex px-[1ch] py-1 gap-1 rounded-lg border border-dark-700 hover:bg-dark-700 hover:border-dark-600">
				<Icon itemIdentifier="divine" variant="inline" />
				<span>=</span>
				<IconPriced costs={[["divine", 1]]} format="c" />
			</span>
		</header>
		{@render children()}
		<footer class="mt-auto flex-none py-2">
			<p class="text-dark-700 text-center">This product isn't affiliated with or endorsed by Grinding Gear Games in any way.</p>
		</footer>
	</main>
</div>