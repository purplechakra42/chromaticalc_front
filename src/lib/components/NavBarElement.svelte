<script lang="ts">
    import Icon from './Icon.svelte';
	import { page } from '$app/state'

    let { href, icon } = $props()
</script>

<a href={`/${href}`}>
    <Icon itemIdentifier={icon} variant={page.url.pathname == `/${href}` ? 'nav_active' : 'nav_inactive'} />
    <!-- <img class="h-12 w-12 border rounded-full p-1 {page.url.pathname == `/${href}` ? "border-gray-100" : "border-gray-600"} bg-gray-700" alt={href} src={icon}/> -->
</a>