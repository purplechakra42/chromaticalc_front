<script lang="ts">
  // import { oneSocketJumpInformation, nSocketJumpInformation } from "$lib/logic/constants"
  import { checkAllRequirements, calculateColoursBench, calculateColoursVorici, calculateColoursTaintedChrome, calculateColoursBlanching } from '$lib/logic/calc'
  import { calculateHarvestWhites, calculateBlanchingWhites } from '$lib/logic/calc'
  import { parseJewellerTree, arrayToRGB, sumOfElements } from '$lib/logic/calc'
  import type { JewellerTree, Instruction } from '$lib/logic/calc';
  type Cost = [string, number]
  
  import InputColour from "$lib/components/InputColour.svelte";
  import DisplayOption from "$lib/components/DisplayOption.svelte";
  import icon from '$lib/assets/DCIcon.png';
  import IconCosts from '$lib/components/IconCosts.svelte';
  import InlineRGB from '$lib/components/InlineRGB.svelte';
  import InlineRGBs from '$lib/components/InlineRGBs.svelte';
  
  import { getPrice } from '$lib/utils/getPrice';
  import { getLEAGUES } from '$lib/context';
	import { blanchingOdds, recipesSockets } from '$lib/logic/constants';
  let leagues = getLEAGUES()
  
  import { Colours } from '$lib/logic/colours.svelte';
  const colours = new Colours()
  import { Requirements } from '$lib/logic/requirements.svelte';
  const requirements = new Requirements()
  let corrupted = $state(false)

  let ready = $derived(checkAllRequirements(colours, requirements))
  let showUWInfo = $state(false)
  let showChromatic = $state(false)
  let showJeweller = $state(false)
  
  // chromes/bench
  let infoChromatic = $derived.by(() => {
    let infos = calculateColoursBench(colours, requirements) // prob, recipe, recipe cost
    let costs = infos.map(([prob, , rcost]) => 1/prob*rcost)
    let costMin = Math.min(...costs)
    let costShow:Cost[] = [['Chromatic Orb', costMin], ['Vaal Orb', corrupted ? costMin : 0 ]]
    let recipe = infos[costs.indexOf(costMin)][1]
    return { infos, costs, costMin, costShow, recipe }
  })
  // jeweller method
  let infoJeweller = $derived.by(() => {
    if (ready !== "Ready" || colours.total == 1 || colours.w > 0) { // we can't jump down to 1 socket (and it's equivalent to the chromatic option anyway)
      return { infos: false, recipe: [0,0,0,0], start: 0, instructions: [['',[]]] as Instruction[], costJeweller: 0, costs: [] }
    }

    let [infos, recipe, start] = calculateColoursVorici(colours, requirements)
    let instructions:Instruction[] = parseJewellerTree(infos as JewellerTree, colours)
    let costJeweller = (infos as JewellerTree)[colours.total-colours.u][0].cost
    let extraCostJeweller = colours.u > 0 ? recipesSockets[colours.total][1] : 0 // if there are unfixed sockets, add the cost for that benchcraft too
    let costs:[string,number][] = [["Jeweller's Orb", costJeweller + extraCostJeweller], ["Chromatic Orb", recipe[3]], ['Vaal Orb', corrupted ? costJeweller+extraCostJeweller+recipe[3] : 0]]
    return { infos, recipe, start, instructions, costJeweller, costs }
  })
  // tainted chromes
  let costTaintedChrome:[string,number][] = $derived([['Tainted Chromatic Orb', 1/calculateColoursTaintedChrome(colours)]])
  // blanching omens
  let costBlanching:[string,number][] = $derived([['Omen of Blanching', 1/calculateColoursBlanching(colours, requirements)]])

  // various techniques for getting white sockets (no other colours)
  let costWhites: [string, string, string, Cost[]][] = $derived.by(() => {
    if (!colours.w) return [['','','', [['',0]]]]
    let costs: [string, string, string, Cost[]][] = []
    
    // option 1: calculate harvest white cost 
    let harvest = calculateHarvestWhites(0, colours.w, colours.totalFixed)
    costs.push([`Harvest until <strong>${colours.w}W</strong>`, 'sacred-lifeforce', '', [["wild-lifeforce", 12500*harvest], ["sacred-lifeforce", harvest]]])
    
    // option 2: calculate the cost in blanchings to hit that many whites, for each available blanching option (1, 2, 3 whites)
    for (let i = 0; i < Math.min(blanchingOdds.length, colours.w); i++) {
      let blanchings = calculateBlanchingWhites(i+1, colours.totalFixed)
      // if there's more whites left, calculate the harvest cost to go higher
      if (colours.w > i+1) {
        harvest = calculateHarvestWhites(i+1, colours.w, colours.totalFixed)
        costs.push([`Blanching until <strong>${i+1}W</strong>, then Harvest until <strong>${colours.w}W</strong>`, 'Omen of Blanching', 'sacred-lifeforce', [["Omen of Blanching", blanchings], ["wild-lifeforce", 12500*harvest], ["sacred-lifeforce", harvest]]])
      } else {
        costs.push([`Blanching until <strong>${colours.w}W</strong>`, 'Omen of Blanching', '', [["Omen of Blanching", blanchings]]])
      }
    }
    // sort by cost ascending
    costs.sort((a,b) => getPrice({costs: a[3], format: 'c'})[0] - getPrice({costs: b[3], format: 'c'})[0])
    return costs
  })

  let sortArr = $derived.by(() => {
    let costs = [infoChromatic.costShow, infoJeweller.costs, costTaintedChrome]
    let priceArr= costs.map((elem, i) => [getPrice({costs: elem, format: "c"})[0], i])
    return priceArr.sort((a,b) => a[0]-b[0])
  })

  // discoverability of dropdowns
  // tooltip for U/W box
  // better inputboxes (arrows? scroll? fancier??)
  // nicer vaal switch
  // finish blanching spreadsheet

  // handle U in jeweller method for 2 jumps
  // handle U/RGB in Harvest methods
</script>

<svelte:head>
  <title>ChromatiCalc</title>
  <link rel="icon" href="/Chromatic_Orb.png" />
</svelte:head>

<div class="flex flex-col w-9/10 md:w-6/10 mx-auto gap-3 py-8 md:pt-16 md:text-lg">
  <h1 class="text-5xl text-center font-bold {ready=="Ready" ? "text-green-300" : ""} pb-4">ChromatiCalc.</h1>

  <div class="w-full grid grid-flow-row grid-cols-[2fr_2fr_2fr_1fr_auto_1fr] grid-rows-[3fr_2fr_3fr] gap-2 pb-2">
    <InputColour colour="red" name="STR" bind:value={requirements.strRaw} />
    <InputColour colour="green" name="DEX" bind:value={requirements.dexRaw} />
    <InputColour colour="blue" name="INT" bind:value={requirements.intRaw} />
    <!-- <button class="border-red-950 border rounded-md col-span-3" onclick={() => corrupted = !corrupted} aria-label="toggle corrupted">
      <Icon itemIdentifier="vaal" variant="inline" />
    </button> -->
    <button class="rounded-3xl col-span-3 row-span-2 bg-cover bg-center bg-no-repeat opacity-90 {corrupted?"border border-red-900":''}" style="background-image: url({icon})" onclick={() => corrupted = !corrupted} aria-label="toggle corrupted"></button>

    {#each requirements.allProb as chance}
      <p class="text-center text-small text-dark-600">{(chance*100).toLocaleString(undefined,{maximumFractionDigits:1})+"%"}</p>
    {/each}
    <!-- <p class="col-span-3"></p> -->
    
    <InputColour colour="red" name="red" placeholder="R" bind:value={colours.rRaw} max=6 />
    <InputColour colour="green" name="green" placeholder="G" bind:value={colours.gRaw} max=6 />
    <InputColour colour="blue" name="blue" placeholder="B" bind:value={colours.bRaw} max=6 />
    <InputColour colour="black" name="unassigned" placeholder="U" bind:value={colours.uRaw} max=6 />
    <button class="text-center justify-center border rounded-full border-dark-100 px-2" onclick={() => showUWInfo = !showUWInfo}>?</button>
    <InputColour colour="white" name="white" placeholder="W" bind:value={colours.wRaw} max=6 />
  </div>

  {#if showUWInfo}
    <DisplayOption basepic="Scroll of Wisdom" text={`"U" stands for "Unfixed" - these are sockets where you don't care about the colour`} costs={[]} />
    <DisplayOption basepic="Scroll of Wisdom" text={`"W" stands for "White" - this acts the same as the RGB sockets`} costs={[]} />
    <DisplayOption basepic="Scroll of Wisdom" modifier="Vaal Orb" text={`The Double Corrupt icon adds Vaal Orb costs (use this if your item is corrupted)`} costs={[]} />
    <svg class="w-full h-0.5"><line x1="0" x2="10000" stroke="white"/></svg>
  {/if}

  {#if ready == "Ready" && !colours.w}
    <div style="order: {sortArr.findIndex(elem => elem[1] == 0)}" class="text-center">
      <DisplayOption basepic="Chromatic Orb" text={`Chromatic Orb - ${arrayToRGB(infoChromatic.recipe)}`} rgb={infoChromatic.recipe} costs={infoChromatic.costShow} strong={showChromatic} vaal={corrupted} onclick={() => showChromatic = !showChromatic} />
      {#if showChromatic}
        <span class="font-bold w-full bg-dark-950 p-1 inline-grid grid-cols-4 border-t-dark-800 border-t rounded-lg">
            <p>Craft Type</p>
            <p>Average Cost</p>
            <p>Success Chance</p>
            <p>Cost per Try</p>
        </span>
        {#each infoChromatic.infos as infoBench, i}
          <span class="w-full p-0.5 inline-grid grid-cols-4
              {infoChromatic.costs.indexOf(infoChromatic.costMin) == i ? "font-bold bg-dark-800 rounded-lg" : "bg-dark-950"}
              {infoChromatic.costs.indexOf(infoChromatic.costMin)+1 == i ? "" : "border-t-dark-800 border-t"}
              {infoChromatic.costs.length-1 == i ? "border-b-dark-800 border-b rounded-b-lg" : ""} ">
            <InlineRGB rgb={infoBench[1]} printchrome={true} alignment="centered" />
            <IconCosts costs={[["Chromatic Orb", 1/infoBench[0]*infoBench[2]]]}/>
            <p>{(100*infoBench[0]).toLocaleString(undefined,{maximumFractionDigits:5, minimumFractionDigits:5})}%</p>
            <IconCosts costs={[["Chromatic Orb", infoBench[2]]]}/>
          </span>
        {/each}
      {/if}
    </div>
  {/if}

  {#if ready == "Ready" && colours.total !== 1 && !colours.w}
    <div style="order: {sortArr.findIndex(elem => elem[1] == 1)}" class="">
      <DisplayOption basepic="Jeweller's Orb" text={'Jeweller Method (Vorici Method)'} costs={infoJeweller.costs} strong={showJeweller} vaal={corrupted} onclick={()=>showJeweller=!showJeweller} />
      {#if showJeweller}
        {#each infoJeweller.instructions as instruction, i}
          <span class="w-full p-0.5 md:px-10 inline-grid grid-cols-[7ch_1fr] gap-[1ch] bg-dark-950 border-t-dark-800 border-t {0 == i ? "rounded-t-lg" : ""}">
            <p class="italic text-right">Step {i+1}:</p>
            <span class="inline-flex">
              <p class="text-wrap text-left">{@html instruction[0]}</p>
              <InlineRGBs rgbs={instruction[1]} bold={true} />
            </span>
          </span>
        {/each}
        <span class="w-full mt-1 py-2 px-1 md:px-10 inline-grid grid-cols-[7ch_1fr] gap-[1ch] text-base bg-dark-950 border-t-dark-500 border-t-2 border-b-dark-800 border-b rounded-b-lg">
          <p class="whitespace-pre-wrap col-span-2">{@html 
            `The Jeweller Method uses the Crafting Bench's socket crafts to reroll the colour of one socket at a time. \n\n` +
            
            `How do you reroll a socket? Here's an example: In Step 1, you set your item to have ${infoJeweller.start} sockets. Then in Step 3, you will use the ${infoJeweller.start+1} Socket craft to set your item to have ${infoJeweller.start+1} sockets. ` +
            `This doesn't affect the first ${infoJeweller.start} sockets, and instead <b>adds</b> a new socket with a new colour. ` +
            `If you then set your item back to ${infoJeweller.start} sockets, it doesn't affect the first ${infoJeweller.start} sockets, and just <b>removes</b> the socket that you just added. \n\n` +
            
            `This process (adding and then removing a socket using the Bench) is called a \"<b>reroll</b>\". You can keep rerolling a single socket until you get the colour that you want, and then start rerolling the next socket. `}
          </p>
        </span>
      {/if}
    </div>
  {/if}

  {#if ready == "Ready" && !leagues.loading && !colours.w}
    <div style="order: {sortArr.findIndex(elem => elem[1] == 2)}" class="">
      <DisplayOption basepic="Tainted Chromatic Orb" text="Tainted Chromatic Orb {!corrupted ? "(Item needs to be Corrupted first)" : ""}" costs={costTaintedChrome} unavailable={!corrupted} />
    </div>
  {/if}

  {#if ready == "Ready" && !leagues.loading && colours.w && colours.w <= 3 && colours.total !== colours.w}
    <DisplayOption basepic="Omen of Blanching" text="Omen of Blanching" costs={costBlanching} unavailable={corrupted} />
  {/if}

  {#if ready == "Ready" && !leagues.loading && colours.w && colours.total == colours.w}
    {#each costWhites as cost}
      <DisplayOption basepic={cost[1]} modifier={cost[2]} text={cost[0]} costs={cost[3]}/>
    {/each}
  {/if}

  {#if ready == "Ready" && !leagues.loading && colours.w > 3 && colours.total > colours.w}
    <DisplayOption basepic="Portal Scroll" text="I haven't calculated any methods for this. Message purplechakra on Discord." costs={[]} />
    <DisplayOption basepic="Scroll of Wisdom" text="Try double-corrupting I guess? Why do you even need this?" costs={[]} />
  {/if}

  {#if ready !== "Ready"}
    <DisplayOption basepic="Mirror of Kalandra" text="Enter your item's Stat Requirements and your desired socket colours!" costs={[]} />
    <DisplayOption basepic="Scroll of Wisdom" text={ready} costs={[]} />
  {/if}
</div>
