<template>
    <div class="rounded-md bg-yellow-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <div class="mt-2 text-sm text-yellow-700">
            <p>Contul tău este aproape gata! Te rugăm să confirmi adresa de e-mail accesând linkul trimis în căsuța ta de e-mail. Doar după confirmare vei putea utiliza toate funcționalitățile contului.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid'
  </script>