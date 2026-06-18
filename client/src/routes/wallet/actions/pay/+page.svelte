<script lang="ts">
    import { resolve } from "$app/paths";

    import qrcodeIcon from "$lib/assets/icons/qrcode.svg";
    import transferIcon from "$lib/assets/icons/transfer.svg";

    const links = [
        { label: 'Pagar com código QR', icon: qrcodeIcon, link: '/wallet/actions/pay/qrcode' },
        { label: 'Pagar com ID da carteira', icon: transferIcon, link: '/wallet/actions/pay/walletid' },
    ] as const;
</script>

<h1 class="font-[Stack_Sans_Headline] text-3xl lg:ml-3 mb-3">Escolher forma de pagamento</h1>
{#each links as { label, icon, link } (label+link) }
    <a href={resolve(link)} class="flex border dark:border-white p-5 rounded-xl h-30 gap-5 items-center hover:teal-filter shadow-lg mb-3">
        <figure class="white-filter h-full aspect-square p-2 hover:teal-filter">
            <img src={icon} alt={label}>
        </figure>
        <p class="text-2xl mr-3 lg:text-3xl">{label}</p>
        <span class="text-4xl ml-auto mr-4">&gt;</span>
    </a>
{/each}
