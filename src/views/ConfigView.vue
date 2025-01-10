<template>
  <div class="grid grid-cols-[auto,1fr] absolute top-0 left-0 w-screen h-screen overflow-hidden">

    <div class="bg-gray-100 p-2 w-44 flex flex-col justify-between overflow-y-auto">
      <div class="flex flex-col gap-1">
        <button
          v-for="item in pages"
          :key="item.id"
          @click="currentPage = item.id"
          :class="{ 'bg-gray-200': currentPage === item.id }"
          class="p-2 w-full flex gap-3 items-center rounded transition-colors"
        >
          <component class="h-5 w-auto" :is="item.icon" /> {{ item.label }}
        </button>
      </div>
      <div class="p-2">
        <button @click="openExternalUrl('https://github.com/philippgitpush/vrc-obs-world-overlay')">
          v{{ packageJson.version }}
        </button>
      </div>
    </div>

    <div class="w-full h-full overflow-y-auto p-4">
      <component :is="currentPageComponent" />
    </div>

  </div>
</template>

<script setup>
  import packageJson from '../../package.json' with { type: 'json' };
  import { ref, computed } from 'vue';

  // Config pages
  import AppearanceConfig from '../components/config/AppearanceConfig.vue';
  import GeneralConfig from '../components/config/GeneralConfig.vue';

  // Icons
  import FadesIcon from '../components/icons/phosphor/regular/Fades.vue';
  import PaintBrushBroadIcon from '../components/icons/phosphor/regular/PaintBrushBroad.vue';

  const pages = [
    { id: 'general-config', label: 'General', component: GeneralConfig, icon: FadesIcon },
    { id: 'appearance-config', label: 'Appearance', component: AppearanceConfig, icon: PaintBrushBroadIcon },
  ];

  const currentPage = ref(pages[0].id);

  const openExternalUrl = (url) => {
    window.electronAPI.openExternalUrl(url);
  }

  const currentPageComponent = computed(() => {
    return pages.find(page => page.id === currentPage.value)?.component || null;
  });
</script>
