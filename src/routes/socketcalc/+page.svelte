<script lang="ts">
	import Icon from "$lib/components/Icon.svelte";

  let linkmode = $state(true)
  const chances = [.5, .67, .75, .90]
</script>

<div class="flex flex-col w-full gap-3 md:text-lg">
  <h1 class="text-5xl text-center font-bold {true ? "text-green-200" : ""} pb-4">{linkmode?"Link":"Socket"}Calc.</h1>

  <button onclick={() => linkmode=!linkmode} class="flex md:w-5/10 w-full mx-auto rounded-2xl p-1 border-y border-blue-200 cursor-pointer {linkmode?"bg-linear-to-l":"bg-linear-to-r"} from-0% from-dark-800 via-25% via-dark-500 to-90% to-dark-950">
    <Icon itemIdentifier="jewellers" centered={true} />
    <Icon itemIdentifier="fusing" centered={true} />
  </button>
</div>