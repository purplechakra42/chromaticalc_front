<script lang="ts">
  import { getDATA, getLEAGUES } from "$lib/context"
  let leagues = getLEAGUES()
  // let costsAndItems = getDATA()

  let leaguesTrade = $derived(leagues.leagues.filter(
    (league: any) => league.rules.every(
    (rule: any) => !["NoParties", "HardMode"].includes(rule.id)) // we don't want SSF or Ruthless modes
  ))
</script>

<div class="text-white">
  <div class="flex flex-col items-center gap-3 py-20 text-base sm:text-lg">
    {#each leaguesTrade as league}
      <p class="{league.id == leagues.currentLeagueID ? "font-bold" : ""}">{league.name}</p>
    {/each}
    <p class="whitespace-pre">{JSON.stringify(leagues, null, 2)}</p>
  </div>
</div>