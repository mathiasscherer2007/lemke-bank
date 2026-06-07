<script lang="ts">
	import { resolve } from '$app/paths';

    import copyIcon from '$lib/assets/icons/copy.svg';
    import payIcon from '$lib/assets/icons/pay.svg';
    import statementIcon from '$lib/assets/icons/statement.svg';
    import arrowinIcon from '$lib/assets/icons/arrow-in.svg';
    import arrowoutIcon from '$lib/assets/icons/arrow-out.svg';

    import MainHeader from '$lib/components/MainHeader.svelte';
    import MainFooter from '$lib/components/MainFooter.svelte';
</script>

<div class="flex flex-col min-h-screen">
	<MainHeader />
	<main class="bg-stone-200 dark:bg-[rgb(27,27,26)] flex-1 px-30 flex flex-col">
		<div class="bg-stone-100 dark:bg-[rgb(46,46,45)] text-stone-900 dark:text-white py-10 px-15 flex-1">
			<div>
				<div class="w-full flex justify-between">
					<p class="text-xl">Saldo atual</p>
                    <span class="flex items-center gap-2">
					    <p class="text-lg dark:text-gray-300">ID da carteira: 123456</p>
                        <button type="button">
                            <img src={copyIcon} alt="Copiar ID" class="w-4 h-4 hover:cursor-pointer dark:invert" aria-label="Copiar ID" />
                        </button>
                    </span>
                </div>
				<p class="text-3xl pl-2 font-bold">BL$ 30</p>
			</div>
            <div class="flex mt-2 h-40">
                <a href={resolve("/wallet/actions/pay")} class="dark:bg-[rgb(35,35,35)] shadow-md aspect-square flex flex-col p-2 m-3 rounded-xl text-center items-center justify-center border border-black dark:border-white hover:border-teal-500 dark:hover:border-teal-400 transition">
                    <figure class="w-7/11 p-3">
                        <img src={payIcon} alt="Realizar Pagamento" class="dark:filter-[brightness(0)_saturate(100%)_invert(100%)_sepia(0%)_saturate(7475%)_hue-rotate(105deg)_brightness(119%)_contrast(100%)]" />
                    </figure>
                    <p class="mb-auto">Realizar Pagamento</p>
                </a>
                <a href={resolve("/wallet/overview/statement")} class="dark:bg-[rgb(35,35,35)] shadow-md aspect-square flex flex-col p-2 m-3 rounded-xl text-center items-center justify-center border border-black dark:border-white hover:border-teal-500 dark:hover:border-teal-400 transition">
                    <figure class="w-7/11 p-3">
                        <img src={statementIcon} alt="Extrato" class="dark:filter-[brightness(0)_saturate(100%)_invert(100%)_sepia(0%)_saturate(7475%)_hue-rotate(105deg)_brightness(119%)_contrast(100%)]" />
                    </figure>
                    <p class="mb-auto">Verificar Extrato</p>
                </a>
            </div>
            <hr class="border-stone-500 my-6" />
            <div class="flex flex-col">
                <p class="text-2xl mb-3">Transações recentes</p>
                <ul class="flex-1 px-2">
                    <li class="flex justify-between text-lg border-y border-stone-500 py-2">
                        <span class="flex items-center gap-2"> 
                            <figure class="w-7 h-7 p-1 green-filter">
                                <img src={arrowinIcon} alt="Entrada" />
                            </figure>
                            <p>Ana P. Lemke</p>
                            <p class="text-stone-500 dark:text-stone-400">| 25/03/26</p>
                        </span>
                        <p class="text-green-500 dark:text-green-400">BL$ 10</p>
                    </li>
                    <li class="flex justify-between text-lg -mt-px border-y border-stone-500 py-2">
                        <span class="flex items-center gap-2">
                            <figure class="w-7 h-7 p-1 filter-[brightness(0)_saturate(100%)_invert(71%)_sepia(71%)_saturate(4987%)_hue-rotate(320deg)_brightness(101%)_contrast(106%)]">
                                <img src={arrowoutIcon} alt="Saída" />
                            </figure>
                            <p>Túlio L. Baségio</p>
                            <p class="text-stone-500 dark:text-stone-400">| 24/03/26</p>
                        </span>
                        <p class="text-red-500 dark:text-red-400">-BL$ 6</p>
                    </li>
                </ul>
            </div>
		</div>
	</main>
    <MainFooter />
</div>
