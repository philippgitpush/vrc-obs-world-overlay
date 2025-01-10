import anime from 'animejs';
import axios from 'axios';

const transitionBetweenImages = (target, clone, image) => {
  target.src = image; // update image src for target element first

  // fade out image clone
  anime({
    targets: clone,
    opacity: 0,
    duration: 700,
    easing: 'easeInOutQuad',
    delay: 300,
    complete: () => {
      // apply new image to image clone
      clone.src = image;

      // fade in image clone
      anime({
        targets: clone,
        opacity: 1,
        duration: 0,
      });
    },
  });
}

const transitionBetweenTexts = (target, text) => {
  const id = target.getAttribute('id');

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

const fetchWorldData = async () => {
  const url = 'http://localhost:1412/settings';

  try {
    const response = await axios.get(url);
    return response.data.overlay.world_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

const parseWorldData = (data) => {
  const schema = {
    id: '',
    name: '',
    author: '',
    image: '',
    platform_pc: false,
    platform_android: false,
    platform_ios: false
  }

  schema['id'] = data.id;
  schema['name'] = data.name;
  schema['author'] = data.authorName;
  schema['image'] = data.imageUrl;

  // match platforms
  if (!Array.isArray(data.unityPackages)) return;
  data.unityPackages.forEach(pkg => {
    switch (pkg.platform) {
      case 'standalonewindows':
        schema['platform_pc'] = true;
        break;
      case 'android':
        schema['platform_android'] = true;
        break;
      case 'ios':
        schema['platform_ios'] = true;
        break;
    }
  });

  return schema;
}

export { transitionBetweenImages, transitionBetweenTexts, fetchWorldData, parseWorldData }
