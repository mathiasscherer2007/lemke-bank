<script lang="ts">
    import type { Snippet } from "svelte";

	interface Props {
		children: Snippet,
		columns?: string
	}

	let { children, columns = "1" }: Props = $props()
</script>

<div class="flex lg:grid overflow-x-scroll overflow-y-hidden items-center h-30 lg:h-auto mt-3 gap-2 scrollbar-none" style="grid-template-columns: repeat({columns}, minmax(0, 1fr));">
	{@render children()}
</div>