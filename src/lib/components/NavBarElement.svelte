<script lang="ts">
    import Icon from './Icon.svelte';
	import { page } from '$app/state'

    let { href, icon, onclick=null } = $props()
</script>

<a href={`/${href}`} {onclick}>
    <Icon itemIdentifier={icon} variant={page.url.pathname == `/${href}` ? 'nav_active' : 'nav_inactive'} />
</a>