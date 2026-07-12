<script lang="ts">
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';

  let { children } = $props();

  $effect(() => {
    let timer = setTimeout(() => {
      goto(resolve('/wallet/overview'));
    }, 10300);

    return () => {
      clearTimeout(timer);
    };
  });
</script>

<div class="flex h-full w-full flex-1 flex-col items-center justify-center">
  {@render children()}
</div>
