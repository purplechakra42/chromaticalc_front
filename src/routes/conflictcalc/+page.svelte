<script lang="ts">
  import { getDATA, getLEAGUES } from "$lib/context"
  let leagues = getLEAGUES()
  let costsAndItems = getDATA()
</script>

<div>
  <div class="flex flex-col items-center gap-3 py-20 text-base sm:text-lg">
    <p>{leagues.currentLeagueID}</p>
    <p class="whitespace-pre">{JSON.stringify(costsAndItems[leagues.currentLeagueID],null,2)}</p>
  </div>
</div>