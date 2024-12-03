<template>
  <div id="wrapper" class="absolute w-full h-full left-0 top-0 block">
    <div id="overlay" class="absolute left-6 bottom-6 flex flex-col gap-3">
      <div class="flex flex-row gap-4">
        <div class="grid grid-cols-[auto,1fr] gap-4">

          <div id="platform" class="mx-auto flex drop-shadow-[2px_2px_2px_rgba(0,0,0,0.6)]">
            <div id="platform_pc" class="off w-14 h-14 font-bold text-xs border-2 opacity-80 z-30">
              PC
            </div>
            <div id="platform_android" class="off w-14 h-14 font-bold text-xs border-2 -ml-2 opacity-80 z-20">
              Quest
            </div>
            <div id="platform_ios" class="off w-14 h-14 font-bold text-xs border-2 -ml-2 opacity-80 z-10">
              iOS
            </div>  
          </div>

          <br>

          <div id="image" class="w-52 h-fit overflow-hidden shadow-[2px_2px_2px_rgba(0,0,0,0.6)] border-white border-2 rounded-xl relative">
            <img id="world_image_clone" class="object-cover absolute top-0 left-0" width="800" height="600" src="/img/placeholder.jpg">
            <img id="world_image" class="object-cover" width="800" height="600" src="/img/placeholder.jpg">
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

<style scoped lang="scss">
  #platform_pc, #platform_android, #platform_ios {
    transition: background-color 0.5s, border-color 0.5s, color 0.5s;
    justify-content: center;
    border-color: white;
    align-items: center;
    border-radius: 50%;
    display: flex;

    &.off {
      background-color: #4c4c4c;
      border-color: #606060;
      color: white;
    }
  }

  #platform_pc {
    background-color: #00B8FF;
  }

  #platform_android {
    background-color: #2ED319;
  }

  #platform_ios {
    background-color: #e83e8c;
  }
</style>

<script setup>
  import { onMounted } from 'vue';
  import anime from 'animejs';
  import axios from 'axios';

  onMounted(() => {
    const elem_world_image = document.getElementById('world_image');
    const elem_world_image_clone = document.getElementById('world_image_clone');
    const elem_world_name = document.getElementById('world_name');
    const elem_world_author = document.getElementById('world_author');
    const elem_platform_pc = document.getElementById('platform_pc');
    const elem_platform_android = document.getElementById('platform_android');
    const elem_platform_ios = document.getElementById('platform_ios');

    const world_data = {
      id: '',
      name: '',
      author: '',
      image: '',
      platform_pc: false,
      platform_android: false,
      platform_ios: false
    }

    let last_world_id = '';
    let first_load = true;

    async function fetchData(url) {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    }

    function parseWorldInfo(data) {
      // return if there is no world data to go by
      if (!data || !data.data_worldInfo) {
        console.error('No world data found.');
        return;
      }

      // populate variables
      world_data['id'] = data.data_lastWorldId;
      world_data['name'] = data.data_worldInfo.name;
      world_data['author'] = data.data_worldInfo.authorName;
      world_data['image'] = data.data_worldInfo.imageUrl;
    }

    function checkPlatformCompatibility(packages) {
      // reset to default states
      world_data['platform_pc'] = false;
      world_data['platform_android'] = false;
      world_data['platform_ios'] = false;

      // match platform compatability
      if (!Array.isArray(packages)) return;
      packages.forEach(pkg => {
        switch (pkg.platform) {
          case 'standalonewindows':
            world_data['platform_pc'] = true;
            break;
          case 'android':
            world_data['platform_android'] = true;
            break;
          case 'ios':
            world_data['platform_ios'] = true;
            break;
        }
      });
    }

    function updateWorldInfoUI() {
      // skip update if the new world_id is same as previouse
      if (last_world_id == world_data['id']) return;
      last_world_id = world_data['id'];

      // update world info ui / overlay data
      if (elem_world_image) swapImage(world_data['image']);
      if (elem_world_name) swapTextAnimated('world_name', world_data['name']);
      if (elem_world_author) swapTextAnimated('world_author', world_data['author']);
      elem_platform_pc.classList.toggle('off', !world_data['platform_pc']);
      elem_platform_android.classList.toggle('off', !world_data['platform_android']);
      elem_platform_ios.classList.toggle('off', !world_data['platform_ios']);
    }

    async function fetchAndProcessWorldData() {
      const url = 'http://localhost:1412/settings'; // electron store data path

      // start data / ui update
      await fetchData(url).then((data) => {
        parseWorldInfo(data);
        checkPlatformCompatibility(data.data_worldInfo.unityPackages);
        updateWorldInfoUI();
      });
    }

    function swapImage(src) {
      // update source for the image element
      elem_world_image.src = src;

      // fade out image clone
      anime({
        targets: elem_world_image_clone,
        opacity: 0,
        duration: 700,
        easing: 'easeInOutQuad',
        delay: 300,
        complete: () => {
          // apply new image to image clone
          elem_world_image_clone.src = src;

          // fade in image clone
          anime({
            targets: elem_world_image_clone,
            opacity: 1,
            duration: 0,
          });
        },
      });
    }

    function swapTextAnimated(id, text) {
      const target = document.getElementById(id);

      // return if the current template doesn't unclude the target
      if (!target) return;

      // wrap all letters into their own span element
      target.innerHTML = target.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      // fade out all letters
      anime({
        targets: `#${id} .letter`,
        opacity: [1, 0],
        duration: 700,
        easing: 'easeInOutQuad',
        delay: (el, i) => 800 / (i + 2),
        complete: () => {
          // check if target has optional prefix
          const prefix = target.getAttribute('data-prefix');
          if (prefix) text = prefix + text;

          // wrap all letters into their own span element (new text content)
          target.innerHTML = text.replace(/\S/g, "<span class='letter'>$&</span>");

          // fade in all letters
          anime({
            targets: `#${id} .letter`,
            opacity: [0, 1],
            duration: 400,
            easing: 'easeInOutQuad',
            delay: (el, i) => 70 * (i + 1),
          })
        },
      });
    }

    function init() {
      fetchAndProcessWorldData();
      setInterval(fetchAndProcessWorldData, 3 * 1000);
    }

    init();
  })
</script>
