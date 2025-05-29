<template>
  <div class="max-w-screen-xl mx-auto p-4 space-y-6">
    <!-- Breadcrumbs -->
    <nav class="text-sm text-gray-500">
      <span>Home</span> / <span>Romania</span> / <span>Bucharest</span>
    </nav>

    <!-- Hero Image Grid -->
    <div class="relative w-full h-[500px] sm:h-[275px] grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-lg">
      <!-- Main Image -->
      <div class="col-span-3 row-span-2 relative">
        <img :src="property.images[0]" alt="Main" class="object-cover w-full h-full rounded-lg" />
        <div class="absolute top-4 right-4 flex gap-2 z-10">
          <button class="btn bg-white text-gray-800">Share</button>
          <button class="btn bg-white text-gray-800">Save</button>
        </div>
        <div class="absolute top-4 left-4 flex gap-2 z-10">
          <span class="bg-white text-sm font-bold uppercase px-2 py-1 rounded">For Sale</span>
          <span class="bg-green-100 text-green-800 text-sm font-bold uppercase px-2 py-1 rounded">New - 1 Hr Ago</span>
        </div>
      </div>
      <!-- Sub Images -->
      <div class="col-span-1 row-span-1">
        <img :src="property.images[1]" alt="Sub1" class="object-cover w-full h-full rounded-lg" />
      </div>
      <div class="col-span-1 row-span-1">
        <img :src="property.images[2]" alt="Sub2" class="object-cover w-full h-full rounded-lg" />
      </div>
    </div>

    <!-- Content Row -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Content -->
      <div class="flex-1 space-y-6">
        <!-- Key Details -->
        <div class="flex flex-wrap gap-6 text-lg font-medium">
          <div>💰 {{ formatPrice(property.price) }}</div>
          <div>🛏️ {{ property.bedrooms }} beds</div>
          <div>🛁 {{ property.bathrooms }} baths</div>
          <div>📐 {{ property.area }} sqm</div>
        </div>

        <!-- Description -->
        <p class="text-gray-700 leading-relaxed">
          {{ property.description }}
        </p>

        <!-- Leaflet Map Custom -->
        <div v-if="showMap" style="width: 100%; height: 400px;">
          <div id="map" style="width: 100%; height: 100%;" />
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="w-full lg:w-[350px] space-y-4">
        <!-- Tour Scheduling Calendar -->
        <div class="bg-white p-4 rounded-xl shadow-md">
          <h2 class="text-xl font-semibold mb-2">Schedule a Tour</h2>
          <input type="date" v-model="tour.date" class="input mb-2" />
          <input type="time" v-model="tour.time" class="input mb-2" />
          <button class="btn w-full" @click="scheduleTour">Schedule</button>
        </div>

        <!-- Request Info Placeholder -->
        <div class="bg-white p-4 rounded-xl shadow-md">
          <h2 class="text-lg font-semibold">Request Info</h2>
          <button class="btn w-full mt-2">Contact Agent</button>
        </div>

        <!-- Agent Card -->
        <div class="bg-white p-4 rounded-xl shadow-md">
          <h2 class="text-lg font-semibold">Agent</h2>
          <p>{{ property.agent.name }}</p>
          <button class="btn mt-2 w-full">Contact</button>
        </div>
      </div>
    </div>

    <!-- Mortgage Calculator -->
    <div class="bg-white p-4 rounded-xl shadow-md w-full lg:w-1/2">
      <h2 class="text-xl font-semibold mb-2">Mortgage Calculator</h2>
      <div class="grid grid-cols-2 gap-4">
        <input v-model.number="mortgage.downPayment" placeholder="Down payment (€)" type="number" class="input" />
        <input v-model.number="mortgage.interestRate" placeholder="Interest rate (%)" type="number" class="input" />
        <input v-model.number="mortgage.years" placeholder="Loan duration (years)" type="number" class="input" />
        <div class="col-span-2">
          Monthly: <strong>{{ calculateMonthlyPayment() }} €</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useNuxtApp } from '#app';

const showMap = ref(false);

const property = {
  title: 'Modern 2-Bedroom Apartment in Central Bucharest',
  address: 'Str. Ion Mihalache, Bucharest, Romania',
  price: 85000,
  bedrooms: 2,
  bathrooms: 1,
  area: 72,
  lat: 44.4479,
  lon: 26.0978,
  images: ['/img/apartment1.jpg', '/img/apartment2.jpg', '/img/apartment3.jpg'],
  description: 'Spacious apartment in a prime location. Close to schools, shops, and metro.',
  agent: {
    name: 'Andrei Popescu',
    phone: '+40 123 456 789'
  }
};

onMounted(async () => {
  if (process.client) {
    showMap.value = true;
    const L = await import('leaflet');
    await import("overlapping-marker-spiderfier-leaflet/dist/oms");
    const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier;

    const map = L.map('map').setView([property.lat, property.lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([property.lat, property.lon]).addTo(map);

    const oms = new OverlappingMarkerSpiderfier(map);
    oms.addMarker(marker);
  }
});

const mortgage = ref({
  downPayment: 20000,
  interestRate: 4.5,
  years: 20
});

function calculateMonthlyPayment() {
  const loanAmount = property.price - mortgage.value.downPayment;
  const monthlyRate = mortgage.value.interestRate / 100 / 12;
  const numPayments = mortgage.value.years * 12;
  const monthly = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numPayments));
  return monthly ? monthly.toFixed(2) : 0;
}

const tour = ref({
  date: '',
  time: ''
});

function scheduleTour() {
  alert(`Scheduled tour on ${tour.value.date} at ${tour.value.time}`);
}

function formatPrice(price) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'EUR' }).format(price);
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition;
}
.input {
  @apply w-full p-2 border border-gray-300 rounded-lg;
}
</style>
