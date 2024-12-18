<template>
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
