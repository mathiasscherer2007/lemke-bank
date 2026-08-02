<script lang="ts">
    import MultiPartForm from "$lib/components/elements/MultiPartForm/MultiPartForm.svelte";

	let fullData = $state({})
</script>

{#snippet receivers()}
	
{/snippet}

{#snippet awaiting()}
	<div>Esperando resposta...</div>
{/snippet}

<div class="flex-1 flex justify-center items-center">
  <div class="flex-1 max-w-1/2 grid">
    <MultiPartForm 
      returnLink='/admin' 
      formAction='?/transfer' 
      submittingSnippet={awaiting} 
      steps={[receivers]} 
      submitObject={fullData}
    />
  </div>
</div>