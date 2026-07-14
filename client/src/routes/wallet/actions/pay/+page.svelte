<script lang="ts">
    import { resolve } from "$app/paths";

    import qrcodeIcon from "$lib/assets/icons/qrcode.svg";
    import transferIcon from "$lib/assets/icons/transfer.svg";
    import arrowIcon from "$lib/assets/icons/arrow-right.svg";

    const links = [
        { label: 'Pagar com QR code', description: 'Escaneie um QR code para realizar um pagamento', icon: qrcodeIcon, link: '/wallet/actions/pay/qrcode' },
        { label: 'Pagar com ID da carteira', description: 'Transfira BL$ de forma direta, utilizando o ID de uma carteira', icon: transferIcon, link: '/wallet/actions/pay/walletid' },
    ] as const;
</script>

<svelte:head>
    <title>Pagar | LemkeBank</title>
</svelte:head>

<h1 class="font-[Stack_Sans_Headline] text-3xl lg:ml-3 mb-3">Escolher forma de pagamento</h1>
<div class="lg:w-2/3">
    {#each links as { label, description, icon, link } (label+link) }
        <a href={resolve(link)} aria-label={label} class="relative flex flex-col lg:flex-row lg:items-center border dark:border-white p-5 rounded-xl lg:h-30 gap-2 lg:gap-5 mb-3 hover:border-teal-500 dark:hover:border-teal-400 transition">
            <figure class="white-filter h-12 lg:h-full aspect-square lg:p-2 flex">
                <img src={icon} alt={label} class="h-full">
                <figure class="inline lg:hidden h-full aspect-square ml-auto white-filter">
                    <img src={arrowIcon} alt="">
                </figure>
            </figure>
            <span>
                <p class="text-2xl my-3 lg:my-0 lg:mr-3 lg:text-3xl">{label}</p>
                <p class="mt-1 lg:text-lg">{description}</p>
            </span>
            <figure class="hidden lg:inline h-2/3 aspect-square ml-auto white-filter">
                <img src={arrowIcon} alt="">
            </figure>
        </a>
    {/each}
</div>
