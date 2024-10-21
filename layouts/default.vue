<template>
  <div>
    <Sidebar />
    <slot />
    <Footer />
    <Notifications />
    <Modal class="z-[100]" />
    <NuxtNotifications position="bottom left" :speed="500" />
  </div>
</template>