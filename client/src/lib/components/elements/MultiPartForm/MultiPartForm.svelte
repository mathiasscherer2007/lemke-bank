<script lang="ts">
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import type { Snippet } from 'svelte';
  import arrowIcon from '$lib/assets/icons/arrow-right.svg';
  import { enhance } from '$app/forms';

  interface Props {
    returnLink: RouteId;
    formAction: string;
    submittingSnippet: Snippet;
    steps: Array<Snippet>;
    submitObject: Record<string, unknown>;
    resetOnSubmit?: () => void;
    valuesToCheck?: Array<unknown>;
    loadEvents?: Map<number, () => void>;
	  submitMessage?: string;
  }

  let { returnLink, formAction, submittingSnippet, steps, submitObject, resetOnSubmit, valuesToCheck, loadEvents, submitMessage = "Enviar" }: Props = $props();

  let totalSteps = $derived(steps.length - 1);
  let currentStep = $state(0);

  let submitting = $state(false);

  function nextStep() {
    currentStep++;

    if (loadEvents?.get(currentStep)) {
      let exec = loadEvents.get(currentStep) as () => void;
      exec()
    }
  }

  function previousStep() {
    currentStep--;
  }

  function checkValues(): boolean {
    if (valuesToCheck) {
      if (!valuesToCheck.every((value) => {if (value) { return true }})) {
        return true;
      };
    };
    return false;
  }
</script>

<a href={resolve(returnLink)} class="flex aspect-square h-10 items-center text-lg italic lg:hidden">
  <img src={arrowIcon} alt="cancelar" class="aspect-square h-full rotate-180 white-filter" />
  cancelar
</a>

{#snippet continueButton(type: 'button' | 'submit', label: string, onClick?: (event: MouseEvent) => void)}
  <button
    type={type}
    onclick={onClick ? onClick : undefined}
    disabled={type === 'submit' ? checkValues() : false}
    class="rounded-lg border p-3 text-lg font-semibold transition enabled:cursor-pointer enabled:border-teal-500 enabled:bg-teal-500 enabled:hover:bg-teal-500/80 lg:w-1/4"
    >{label}</button
  >
{/snippet}

{#snippet returnButton()}
  <button
    type="button"
    onclick={previousStep}
    class="w-full rounded-lg border border-teal-500 p-3 text-lg font-semibold text-teal-500 transition enabled:cursor-pointer enabled:hover:bg-teal-500/80 lg:w-1/4 dark:border-teal-400 dark:text-teal-400"
    >Voltar</button
  >
{/snippet}

{#snippet cancelLink()}
  <a
    href={resolve(returnLink)}
    class="hidden w-1/6 cursor-pointer rounded-lg border border-red-500 bg-transparent p-3 text-center font-bold text-red-500 transition hover:bg-[rgba(0,0,0,0.03)] lg:inline dark:border-red-400 dark:text-red-400 dark:hover:bg-[rgba(255,255,255,0.05)]"
    >Cancelar</a
  >
{/snippet}

<form
  action={formAction}
  method="POST"
  autocomplete="off"
  class="flex-1 place-items-center grid"
  use:enhance={({ formData }) => {
    submitting = true;
    formData.append('fullData', JSON.stringify(submitObject))

    return async ({ update }) => {
      resetOnSubmit?.();
      submitting = false;
      await update();
    }
  }}
>
  {#if submitting}
    <span class="col-start-1 row-start-1">
      {@render submittingSnippet()}
    </span>
  {:else}
    <span class="col-start-1 row-start-1 h-full w-full">
      <div class="grid grid-cols-1 grid-rows-1 w-full flex-1">
        {#key currentStep}
          <div class="col-start-1 row-start-1 w-full bg-[#00000020] p-6 pb-0 rounded-t-lg">
            {@render steps[currentStep]()}
          </div>
        {/key}
      </div>

      <div class="grid grid-cols-1 grid-rows-1">
        {#if currentStep === 0}
          <span class="col-start-1 row-start-1 mb-5 flex w-full flex-col justify-end gap-2 lg:mb-0 lg:flex-row bg-[#00000020] p-6 pt-0 rounded-b-lg">
            {@render cancelLink()}
            {@render continueButton('button', 'Continuar', nextStep)}
          </span>

        {:else if currentStep < totalSteps}
          <span class="col-start-1 row-start-1 flex w-full flex-col justify-between gap-2 lg:flex-row bg-[#00000020] p-6 pt-0 rounded-b-lg">
            <span class="flex flex-1 gap-2">
              {@render returnButton()}
              {@render cancelLink()}
            </span>
          </span>

        {:else}
          <span class="col-start-1 row-start-1 flex w-full flex-col justify-between gap-2 lg:flex-row bg-[#00000020] p-6 pt-0 rounded-b-lg">
            <span class="flex flex-1 gap-2">
              {@render returnButton()}
              {@render cancelLink()}
            </span>
            {@render continueButton('submit', submitMessage)}
          </span>
        {/if}
      </div>
    </span>
  {/if}
</form>
