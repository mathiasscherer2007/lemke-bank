<script lang="ts">
  import type { RouteId } from '$app/types';
  import { enhance } from '$app/forms';
  import type { Snippet } from 'svelte';

  import ContinueButton from '../Forms/ContinueButton.svelte';
    import CancelLink from '../Forms/CancelLink.svelte';

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

{#snippet submitButton(label: string)}
  <button
    type="submit"
    disabled={checkValues()}
    class="rounded-lg border p-3 text-lg font-semibold transition enabled:cursor-pointer enabled:border-teal-500 enabled:bg-teal-500 enabled:hover:bg-teal-500/80 lg:w-1/4"
    >{label}</button
  >
{/snippet}

{#snippet returnButton()}
  <button
    type="button"
    onclick={previousStep}
    class="w-full rounded-lg border border-teal-500 p-3 text-lg font-semibold text-teal-500 transition enabled:cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 lg:w-1/4 dark:border-teal-400 dark:text-teal-400"
    >Voltar</button
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
          <div class="col-start-1 row-start-1 w-full lg:bg-[#00000020] lg:p-6 lg:pb-0 rounded-t-lg">
            {@render steps[currentStep]()}
          </div>
        {/key}
      </div>

      <div class="grid grid-cols-1">
        {#if currentStep === 0}
          <span class="col-start-1 row-start-1 mb-5 flex w-full flex-col justify-end gap-2 lg:mb-0 lg:flex-row lg:bg-[#00000020] lg:p-6 lg:pt-0 rounded-b-lg">
            <CancelLink {returnLink} />
            <ContinueButton label='Continuar' onClick={nextStep} />
          </span>

        {:else if currentStep < totalSteps}
          <span class="col-start-1 row-start-1 flex w-full flex-col justify-between gap-2 lg:flex-row lg:bg-[#00000020] lg:p-6 lg:pt-0 rounded-b-lg">
            <span class="flex flex-1 gap-2">
              {@render returnButton()}
              <CancelLink {returnLink} />
            </span>
            <ContinueButton label='Continuar' onClick={nextStep} />
          </span>

        {:else}
          <span class="col-start-1 row-start-1 flex lg:w-full flex-col justify-end lg:justify-between gap-2 lg:flex-row lg:bg-[#00000020] lg:p-6 lg:pt-0 rounded-b-lg">
            <span class="lg:flex lg:flex-1 lg:gap-2">
              {@render returnButton()}
              <CancelLink {returnLink} />
            </span>
            {@render submitButton(submitMessage)}
          </span>
        {/if}
      </div>
    </span>
  {/if}
</form>
