<script lang="ts">
	interface Props {
		label: string;
		onClick?: (event: Event) => void;
	}

	let { label, onClick }: Props = $props()
</script>

<button
  type="button"
  onclick={onClick ? onClick : undefined}
  class="rounded-lg border p-3 text-lg font-semibold transition enabled:cursor-pointer enabled:border-teal-500 enabled:bg-teal-500 enabled:hover:bg-teal-500/80 lg:w-1/4"
  >{label}</button
>
