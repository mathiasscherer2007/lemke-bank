<script lang="ts">
  import type { Attachment } from 'svelte/attachments';

  let { duration, color } = $props();

  const progressAttachment: Attachment = (element) => {
    let width = 0;

    const intervalTime = 100;
    const totalSteps = duration / intervalTime;
    const stepIncrement = 100 / totalSteps;

    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
      } else {
        width += stepIncrement;
        const displayWidth = width;
        element.style.width = displayWidth + '%';
      }
    }, intervalTime);
  };
</script>

<div class="w-90 my-5 bg-stone-500/40 p-1 rounded-xl">
  <div {@attach progressAttachment} id="myProgressBar" class="w-0 h-5 {color === "green" ? "bg-green-500 dark:bg-green-400" : "bg-red-500 dark:bg-red-400"} rounded-xl transition-all"></div>
</div>