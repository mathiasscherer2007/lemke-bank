<script lang="ts">
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';

  let { returnLink }: { returnLink: RouteId } = $props();
</script>

<a
  href={resolve(returnLink)}
  class="hidden w-1/6 cursor-pointer rounded-lg border border-red-500 bg-transparent p-3 text-center font-bold text-red-500 transition hover:bg-[rgba(0,0,0,0.03)] lg:inline dark:border-red-400 dark:text-red-400 dark:hover:bg-[rgba(255,255,255,0.05)]"
  >Cancelar</a
>
