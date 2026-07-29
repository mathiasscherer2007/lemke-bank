<script lang="ts">
    import { page } from "$app/state";
	import { resolve } from "$app/paths";
    import type { Attachment } from "svelte/attachments";
	import { toCanvas } from 'qrcode';
    import CopyButton from "$lib/components/elements/CopyButton.svelte";
    import type { HTMLValueElement } from "$lib/types/HTMLValueElement";

	let link = $state(page.url.searchParams.get("link") || '');
	
	const generateQrCode: Attachment = (element) => {
		const options = {
			margin: 2
		}
		toCanvas(element, link, options);
	}

	let linkElement: HTMLValueElement | undefined = $state();
</script>

<div class="flex-1 flex flex-col justify-center items-center gap-3">
	<div class="w-1/2 max-w-80">
		<canvas {@attach generateQrCode} class="qrcode rounded-lg"></canvas>
	</div>
	<div class="w-full max-w-80 flex gap-2">
		<textarea bind:this={linkElement} name="link" readonly rows="1" spellcheck="false" class="flex-1 text-lg border border-stone-500 rounded p-1 resize-none overflow-y-hidden overflow-x-scroll scrollbar-none text-nowrap">{link}</textarea>
		<span class="h-6 aspect-square my-auto">
			<CopyButton elementToCopy={linkElement} tooltipPosition='right' />
		</span>
	</div>
	<a href={resolve('/admin')} class=" text-teal-500 dark:text-teal-400 underline">Voltar para página principal</a>
</div>

<style>
	.qrcode {
		width: 100% !important;
		height: auto !important;
		display: block;
		image-rendering: pixelated;
  		image-rendering: crisp-edges;
	}
</style>