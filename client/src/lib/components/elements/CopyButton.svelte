<script lang="ts">
  import copyIcon from '$lib/assets/icons/copy.svg';
  import checkIcon from '$lib/assets/icons/check.svg';
  import { isValueElement, type HTMLValueElement } from '$lib/types/HTMLValueElement';
  import type { Attachment } from 'svelte/attachments';
  import tippy from 'tippy.js';

  interface Props {
    elementToCopy: HTMLElement | HTMLValueElement;
    tooltipText?: string;
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  }

  let { elementToCopy, tooltipText="Copiar", tooltipPosition='top' }: Props = $props();
  let showCheck = $state(false);

  async function onclick() {
    showCheck = true;

    if (isValueElement(elementToCopy)) {
      await navigator.clipboard.writeText(elementToCopy.value);
    } else {
      await navigator.clipboard.writeText(elementToCopy.innerText);
    };

    setTimeout(() => showCheck = false, 2000);
  }

  const copiedTooltip: Attachment = (element) => {
    tippy(element, {
      content: tooltipText,
      placement: tooltipPosition,
      animation: 'fade'
    })
  }
</script>

<button {@attach copiedTooltip} {onclick} type="button" class="aspect-square h-full">
  <img
    src={showCheck ? checkIcon : copyIcon}
    alt="Copiar ID"
    class="object-cover white-filter hover:cursor-pointer"
    aria-label="Copiar ID"
  />
</button>
