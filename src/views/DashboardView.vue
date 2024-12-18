<template>
  <div class="p-4">
    <span class="block mb-4">
      Hi, if you're seeing this, you've stumbled across an early version that separates all settings from the “preview”, which is now converted to a dashboard. The dashboard is currently not displaying the correct world info, <b>this is mostly initial animation and layout preperation</b>. Most settings are just a visual preview.
    </span>

    <button class="block bg-blue-200 px-3 py-2 mb-2 hover:bg-blue-300 transition-colors" @click="openConfigWindow">
      Open Settings
    </button>
    <button class="block bg-pink-200 px-3 py-2 mb-2 hover:bg-pink-300 transition-colors" @click="openExternalUrl">
      Open Overlay URL
    </button>
    <button class="block bg-pink-200 px-3 py-2 mb-2 hover:bg-pink-300 transition-colors" @click="copyOverlayUrl">
      Copy Overlay URL
    </button>
  </div>

  <div class="p-6 min-h-screen flex flex-col justify-center">
    <div class="flex flex-col items-center">

      <PlatformsComponent class="mb-8" />

      <div class="w-60 h-40 mb-8 rounded-3xl overflow-hidden border-">
        <img src="/img/placeholder.jpg" class="object-cover w-full h-full">
      </div>

      <div class="mb-3 flex whitespace-nowrap overflow-hidden w-full marquee">
        <div class="text-5xl text-gray font-extrabold mx-auto">
          Loading ...
        </div>
      </div>

      <div class="flex whitespace-nowrap overflow-hidden w-full marquee">
        <div class="text-xl font-extrabold text-gray mx-auto">
          This should be quick ..
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
  import PlatformsComponent from '../components/overlay/Platforms.vue';
  import { onMounted, onUnmounted, ref } from 'vue';
  import anime from 'animejs';

  const ongoing_animations = [];
  const app_port = ref(null);

  const openConfigWindow = () => window.electronAPI.openConfigWindow();
  const copyOverlayUrl = () => navigator.clipboard.writeText(`http://localhost:${app_port.value}/`);
  const openExternalUrl = (url) => window.electronAPI.openExternalUrl(`http://localhost:${app_port.value}/`);

  const playTextMarqueeAnimation = (wrapper, inner) => {
    const wrapper_width = wrapper.clientWidth;
    const inner_width = inner.scrollWidth;

    // return if target is not overflowing
    if (inner_width <= wrapper_width) return;

    const overflow = inner_width - wrapper_width;
    const timeline = anime.timeline({
      loop: true,
      easing: 'easeInOutQuad',
    }).add({
      targets: inner,
      translateX: [0, -overflow],
      duration: overflow * 15,
      delay: 2000,
    }).add({
      targets: inner,
      translateX: [-overflow, 0],
      duration: overflow * 15,
      delay: 2000,
    });

    // store animation into ongoing for later cleanup
    ongoing_animations.push(timeline);
  }

  let resize_timeout;

  // remove and reset animations when window is resizing
  const handleResize = (event) => {
    ongoing_animations.forEach(animation => {
      // seek back to start, pause and remove timeline / animation from animejs
      animation.seek(0);
      animation.pause();
      anime.remove(animation);

      // remove animation from ongoing
      if (ongoing_animations.indexOf(animation) !== -1) ongoing_animations.splice(ongoing_animations.indexOf(animation), 1);
    });

    // call resize end when window resize is finished
    clearTimeout(resize_timeout);
    resize_timeout = setTimeout(() => { handleResizeEnd() }, 300);
  };

  const handleResizeEnd = () => { // re-play all animations
    initializeAnimations();
  };

  const initializeAnimations = () => {
    // marquee text animation
    const marquee_elements = document.querySelectorAll('.marquee');
    marquee_elements.forEach(element => { playTextMarqueeAnimation(element, element.firstChild) });
  }

  onMounted(() => {
    // get current app port for overlay URLs
    window.electronAPI.getConfig('app.port').then((value) => {
      app_port.value = value || '1412';
    });

    // add event listeners for animations that depend on window resizing
    window.addEventListener("resize", handleResize);

    // initialize all animations
    setTimeout(() => { initializeAnimations() }, 200);
  });

  onUnmounted(() => {
    // clear event listeners
    window.removeEventListener("resize", handleResize);
  });
</script>
