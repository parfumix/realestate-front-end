<template>
  <div>
    <Sidebar />
    <slot />
    <Footer />
    <Notifications />
    <Modal class="z-[100]" />
  </div>
</template>