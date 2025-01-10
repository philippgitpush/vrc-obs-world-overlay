<template>
  <div id="wrapper" class="absolute w-full h-full left-0 top-0 block">
    <div id="overlay" class="absolute left-6 bottom-6 flex flex-col gap-3">
      <div class="flex flex-row gap-4">
        <div class="grid grid-cols-[auto,1fr] gap-4">

          <PlatformsComponent />

          <br>

          <div id="image" class="w-52 h-fit overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.6)] border-white border-2 rounded-xl relative aspect-[4/3]">
            <img id="world_image_clone" class="object-cover w-full h-full absolute top-0 left-0" width="800" height="600" src="/img/placeholder.jpg">
            <img id="world_image" class="object-cover w-full h-full" width="800" height="600" src="/img/placeholder.jpg">
          </div>

          <div id="contents" class="flex flex-col justify-center text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.6)]">
            <span id="world_name" class="text-5xl font-extrabold leading-none mb-1">Loading ...</span>
            <span id="world_author" class="text-2xl font-bold leading-none" data-prefix="by ">This should be quick</span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import PlatformsComponent from '../components/overlay/Platforms.vue';
  import { transitionBetweenImages, transitionBetweenTexts, fetchWorldData, parseWorldData } from '../helpers.js'
  import { onMounted } from 'vue';

  onMounted(() => {
    const elem_world_image = document.getElementById('world_image');
    const elem_world_image_clone = document.getElementById('world_image_clone');
    const elem_world_name = document.getElementById('world_name');
    const elem_world_author = document.getElementById('world_author');
    const elem_platform_pc = document.getElementById('platform_pc');
    const elem_platform_android = document.getElementById('platform_android');
    const elem_platform_ios = document.getElementById('platform_ios');

    let last_world_id = '';

    const updateWorldInfoUI = (data) => {
      if (elem_world_image) transitionBetweenImages(elem_world_image, elem_world_image_clone, data['image']);
      if (elem_world_name) transitionBetweenTexts(elem_world_name, data['name']);
      if (elem_world_author) transitionBetweenTexts(elem_world_author, data['author']);

      elem_platform_pc.classList.toggle('off', !data['platform_pc']);
      elem_platform_android.classList.toggle('off', !data['platform_android']);
      elem_platform_ios.classList.toggle('off', !data['platform_ios']);
    }

    const fetchAndUpdateWorldData = async () => {
      await fetchWorldData().then((data) => {
        const parsed = parseWorldData(data);

        // skip if there is no data
        if (!data || !parsed) return;
        
        // skip if there was no change
        if (last_world_id == parsed['id']) return; 

        last_world_id = parsed['id'];
        updateWorldInfoUI(parsed);
      });
    }

    const init = () => {
      fetchAndUpdateWorldData();
      setInterval(fetchAndUpdateWorldData, 3 * 1000);
    }

    init();
  })
</script>
