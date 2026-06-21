<script lang="ts">
    import { slide } from "svelte/transition";

    let formStage = $state(0);
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
    }
</script>

<form action="?pay" method="post" class="w-full">
    {#if formStage === 0}
        <div in:slide out:slide class="overflow-x-hidden">
            <h1 class="font-[Stack_Sans_Headline] text-3xl lg:ml-3 mb-3">Digite ou cole o ID da carteira do recebedor</h1>
            <span>
                <input type="text" name="reciever" id="reciever" placeholder="ID da carteira" required bind:value={formData.reciever}>
            </span>
            <button type="button" disabled={formData.reciever ? false : true} onclick={() => {moveToNextStep(formData.reciever)}}>Continuar</button>
        </div>
    {:else if formStage === 1}
        <div in:slide={{ delay:500 }} out:slide>
            <h1 class="font-[Stack_Sans_Headline] text-3xl lg:ml-3 mb-3">Digite o valor que deseja transferir</h1>
            <span>
                <label for="amount">BL$</label>
                <input type="number" min="0" name="amount" id="amount" required bind:value={formData.amount}>
            </span>
            <span>
                <label for="description">Descrição (opcional)</label>
                <input type="text" name="description" id="description" bind:value={formData.description}/>
            </span>
            <button type="submit" disabled={formData.amount ? false : true} onclick={() => {moveToNextStep(formData.amount)}}>Enviar Pagamento</button>
        </div>
    {/if}
</form>