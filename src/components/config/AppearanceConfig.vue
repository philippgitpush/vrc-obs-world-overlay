<template>
  <div class="mt-2">
    <h1 class="font-bold text-xl mb-1">
      Appearance Settings
    </h1>
    <p>
      These are options that change the layout and appearance of the overlay.
    </p>
  </div>

  <hr class="mt-6 mb-6">

  <div>
    <h2 class="font-bold text-lg mb-1">
      Overlay Placement
    </h2>
    <p class="mb-6">
      Choose where you want the overlay to show up.
    </p>
    <div class="mt-4 grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
      <div v-for="(desc, placement) in overlay_placement_options"
      :key="placement">
        <div
          class="w-full aspect-[16/9] rounded-xl border-2 cursor-pointer transition-colors hover:border-indigo-500"
          :class="{
            'bg-indigo-200 border-indigo-400': placement === overlay_placement,
            'bg-gray-200 border-gray-300': placement !== overlay_placement
          }"
          @click="setOverlayPlacement(placement)">
          <PlacementTopLeftIcon v-if="placement === 'top-left'" :fill="placement === overlay_placement ? '#818cf8' : '#d1d5db'" />
          <PlacementTopRightIcon v-if="placement === 'top-right'" :fill="placement === overlay_placement ? '#818cf8' : '#d1d5db'" />
          <PlacementBottomLeftIcon v-if="placement === 'bottom-left'" :fill="placement === overlay_placement ? '#818cf8' : '#d1d5db'" />
          <PlacementBottomRightIcon v-if="placement === 'bottom-right'" :fill="placement === overlay_placement ? '#818cf8' : '#d1d5db'" />
        </div>
        <p class="mt-2 text-center text-gray-700 font-semibold">
          {{ desc }}
        </p>
      </div>
    </div>
  </div>

  <hr class="mt-6 mb-6">

  <div>
    <h2 class="font-bold text-lg mb-1">
      Platform-Icons Style
    </h2>
    <p class="mb-6">
      Choose how you want the pc, android and iOS platform icons to look like.
    </p>
    <div class="mt-4 grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
      <div class="bg-gray-200 w-full aspect-[16/9] rounded-xl border-2 border-gray-300 cursor-pointer"></div>
      <div class="bg-gray-200 w-full aspect-[16/9] rounded-xl border-2 border-gray-300 cursor-pointer"></div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';

  import PlacementTopLeftIcon from '../icons/overlayplacement/TopLeft.vue';
  import PlacementTopRightIcon from '../icons/overlayplacement/TopRight.vue';
  import PlacementBottomLeftIcon from '../icons/overlayplacement/BottomLeft.vue';
  import PlacementBottomRightIcon from '../icons/overlayplacement/BottomRight.vue';

  const overlay_placement = ref(null);
  const overlay_placement_options = {
    'top-left': 'Top Left',
    'top-right': 'Top Right',
    'bottom-left': 'Bottom Left',
    'bottom-right': 'Bottom Right'
  };

  const setOverlayPlacement = (pos) => {
    overlay_placement.value = pos;
    window.electronAPI.setConfig('overlay.placement', pos);
  }

  onMounted(() => {
    window.electronAPI.getConfig('overlay.placement').then((value) => {
      overlay_placement.value = value;
    });
  })
</script>
