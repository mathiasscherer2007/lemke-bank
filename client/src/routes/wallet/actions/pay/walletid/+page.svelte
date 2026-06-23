<script lang="ts">
    import { enhance } from "$app/forms";
    import { fly } from "svelte/transition";

    let formStage = $state(1);
    let formData = $state({
        reciever: '',
        amount: 0,
        description: ''
    });

    function moveToNextStep(valueToCheck: string | number) {
        if (!valueToCheck) {
            return;
        }

        formStage++;
    };

    function returnStep() {
        formStage--;
    }
</script>

<form action="?pay" method="post" class="w-full" use:enhance={() => {

}}>
    {#if formStage === 0}
        <div in:fly out:fly class="overflow-x-hidden w-2/3 flex flex-col">
            <h1 class="font-[Stack_Sans_Headline] text-3xl lg:ml-3 mb-3">Digite ou cole o ID da carteira do recebedor</h1>
            <span class="p-3">
                <input type="text" name="reciever" id="reciever" placeholder="ID da carteira" required bind:value={formData.reciever} class="p-1 text-xl border-b-teal-400 border-b">
            </span>
            <button type="button" disabled={formData.reciever ? false : true} onclick={() => {moveToNextStep(formData.reciever)}} class="w-1/4 ml-auto cursor-pointer rounded-xl p-3 font-bold transition bg-teal-400 dark:text-black border border-teal-400 disabled:text-teal-400 dark:enabled:hover:bg-teal-500 disabled:bg-transparent disabled:cursor-default">Continuar</button>
        </div>
    {:else if formStage === 1}
        <div in:fly={{ delay:500 }} out:fly class="overflow-x-hidden w-2/3 flex flex-col">
            <h1 class="font-[Stack_Sans_Headline] text-3xl lg:ml-3 mb-3">Digite o valor que deseja transferir</h1>
            <span>
                <label for="amount" class="text-xl">BL$</label>
                <input type="number" min="0" name="amount" id="amount" required bind:value={formData.amount} class="p-1 text-xl border-b-teal-400 border-b w-[7ch]" />
            </span>
            <span class="my-5 flex flex-col">
                <input type="text" name="description" id="description" placeholder="Descrição (opcional)" bind:value={formData.description} class="p-1 text-xl border-b-teal-400 border-b" />
            </span>
            <span class="flex justify-end gap-2">
                <button type="button" onclick={returnStep} class="w-1/5 cursor-pointer rounded-xl p-3 font-bold transition bg-teal-400 dark:text-black border border-teal-400 dark:enabled:hover:bg-teal-500">Voltar</button>
                <button type="submit" disabled={formData.amount ? false : true} class="w-1/4 cursor-pointer rounded-xl p-3 font-bold transition bg-teal-400 dark:text-black border border-teal-400 disabled:text-teal-400 dark:enabled:hover:bg-teal-500 disabled:bg-transparent disabled:cursor-default">Enviar Pagamento</button>
            </span>
        </div>
    {/if}
</form>