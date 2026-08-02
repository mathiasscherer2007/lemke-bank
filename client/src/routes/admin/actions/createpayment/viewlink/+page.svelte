<script lang="ts">
    import { page } from "$app/state";
	import { resolve } from "$app/paths";
    import type { Attachment } from "svelte/attachments";
	import { toCanvas } from 'qrcode';
    import CopyButton from "$lib/components/elements/CopyButton.svelte";
    import type { HTMLValueElement } from "$lib/types/HTMLValueElement";
    import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	let totalSeconds = $state(0);

	if (data.timeRemaining) {
		totalSeconds = Math.max(0, Math.floor((Number(data.timeRemaining) - Date.now()) / 1000))
	}
	setInterval(() => {
		if (data.timeRemaining) {
			totalSeconds = Math.max(0, Math.floor((Number(data.timeRemaining) - Date.now()) / 1000))
		}
	}, 1000)

	let minutes = $derived(Math.floor(totalSeconds / 60));
	let seconds = $derived(String(totalSeconds % 60).padStart(2, '0'));

	let link = $state(page.url.searchParams.get("link") || '');
	
	const generateQrCode: Attachment = (element) => {
		const options = {
			margin: 2
		}
		toCanvas(element, link, options);
	}

	let linkElement: HTMLValueElement | undefined = $state();
</script>

<div class="bg-zinc-200/70 lg:dark:bg-black/10 rounded-lg lg:w-1/2 px-3 lg:p-5 self-center my-auto grid grid-rows-[1fr_auto_auto] lg:grid-rows-none lg:grid-cols-[1fr_auto_1fr]">
	<span class="flex flex-col gap-3 items-center justify-center">
		<div class="w-full">
			<canvas {@attach generateQrCode} class="qrcode rounded-lg"></canvas>
		</div>
		<p class="text-lg lg:text-md italic text-neutral-500 dark:text-neutral-400">ou, copie o link</p>
		<div class="flex gap-3 w-full max-w-80">
			<textarea bind:this={linkElement} name="link" readonly rows="1" spellcheck="false" class="bg-neutral-400/10 flex-1 text-lg border border-neutral-500 rounded p-1 resize-none overflow-y-hidden overflow-x-scroll scrollbar-none text-nowrap">{link}</textarea>
			<span class="h-6 aspect-square my-auto">
				<CopyButton elementToCopy={linkElement} tooltipPosition='right' />
			</span>
		</div>
	</span>
	<div class="bg-neutral-400 my-5 lg:my-2 h-0.5 lg:h-auto lg:w-0.5 rounded lg:mx-5"></div>
	<span class="lg:p-3 flex flex-col lg:justify-evenly">
		<span class="flex flex-col">
			<p class="font-semibold text-xl text-center">Tempo de vida estimado do link</p>
			<h3 class="text-center text-4xl mt-4">{minutes}:{seconds}</h3>
		</span>
		<ul class="hidden lg:flex flex-col gap-2 list-disc text-lg text-justify mx-2">
			<li>Pagamentos expiram após 5 minutos, caso não tenham sido concluídos</li>
			<li>Pagamentos só podem ser completos por um único usuário</li>
			<li>Você não pode completar um pagamento criado por você mesmo(a)</li>
		</ul>
		<a href={resolve('/admin')} class="text-link self-center mt-5 lg:mt-0">Voltar para página inicial</a>
	</span>
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