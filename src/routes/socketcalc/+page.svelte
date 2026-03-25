<script lang="ts">
  import { getPrice } from "$lib/utils/getPrice";
  import { taintedJewellerOdds, recipesSockets } from "$lib/logic/constants";
  import Icon from "$lib/components/Icon.svelte";
  type Cost = [string, number]

  let linkmode = $state(true)

  let info: Record<string,Cost[][]> = {}
  let costs: Record<string,Cost[]> = {}
  for (let r of recipesSockets) {
    if (![0, 1, recipesSockets.length-1].includes(r[0])) { 
      info[r[0]] = []
      costs[r[0]] = []
    }
  }
  const chances = Array(10).fill(0).map((_,i) => 0.5+i*0.05)
  chances.push(0.99)

  for (let start of Object.keys(info)) {
    let resetcost = recipesSockets[Number(start)][1]
    for (let chance of chances) {
      let state = taintedJewellerOdds[start].find((elem) => elem[2] >= chance)
      if (state) {
        info[start].push([["Tainted Orb of Fusing", state[0]], ["jewellers", resetcost*state[1]], ["vaal", resetcost*state[1]]])
      } else {
        info[start].push([["chaos",0]])
      }
    }
  }

  // transpose for easier row comparison? do it in one hit? do constant stuff in calc and then bring it in for price calcs?
  for (let start of Object.keys(info)) {
    for (let costIn of start) {

    }
  }

  // instructions below always shown. hover/click a column to change?
  // explanation of table, suggest a risk tolerance?
  // show actual costs somewhere, maybe on cell hover? how tell user
</script>

<div class="flex flex-col w-full gap-3 md:text-lg">
  <h1 class="text-5xl text-center font-bold {true ? "text-green-200" : ""} md:pb-4">{linkmode?"Link":"Socket"}Calc.</h1>

  <button onclick={() => linkmode=!linkmode} class="flex md:w-5/10 w-full mx-auto rounded-2xl p-1 border-y border-blue-200 cursor-pointer {linkmode?"bg-linear-to-l":"bg-linear-to-r"} from-0% from-dark-800 via-25% via-dark-500 to-90% to-dark-950">
    <Icon itemIdentifier="jewellers" centered={true} />
    <Icon itemIdentifier="fusing" centered={true} />
  </button>

  <table class="text-center border">
    <thead>
      <tr>
        <th class="w-1/6">test</th>
        {#each Object.keys(info) as start}
          <th class="w-1/5">{start}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each chances as chance, i}
        <tr class="">
          <td class="border p-1">{(chance*100).toFixed(0)}%</td>
          {#each Object.keys(info) as start}
            <td class="">{getPrice({ costs: info[start][i] })[0].toFixed(1)} {getPrice({ costs: info[start][i] })[1][0]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>