<template>
  <div class="h-full">
    <Sidebar />
    <slot />
    <!-- <Footer /> -->
    <Notifications />
    <Modal class="z-[1900]" />
    <NuxtNotifications position="bottom left" :speed="500" />
  </div>
</template>