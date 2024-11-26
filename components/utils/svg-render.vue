<template>
    <div>
      <div v-if="svgContent" v-html="svgContent"></div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        svgContent: null, // Stores the SVG content as a string
      };
    },
    props: {
      svgUrl: {
        type: String,
        required: true,
      },
    },
    mounted() {
      this.loadSvg();
    },
    methods: {
      async loadSvg() {
        try {
          const response = await fetch(this.svgUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch SVG: ${response.statusText}`);
          }
          this.svgContent = await response.text();
        } catch (error) {
          console.error(error);
          this.svgContent = '<p>Error loading SVG</p>';
        }
      },
    },
  };
  </script>
  