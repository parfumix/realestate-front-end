<template>
  <div class="h-full w-full bg-white flex flex-col relative">
    <!-- Header -->
    <div class="bg-blue-500 text-white px-4 rounded-tl-lg flex items-center">
      <MessageCircleQuestion />
      <h1 class="text-lg py-2 font-semibold leading-6 pl-2">Pune orice întrebare</h1>
    </div>

    <!-- Tabs -->
    <div
      v-if="!defaultThreadMessages.length"
      :class="[tabs.length > 1 ? 'border-b border-gray-200' : '', 'mx-auto flex justify-center']"
    >
      <nav class="-mb-px flex space-x-[12px]" v-if="tabs.length > 1">
        <a
          v-for="(tab, index) in tabs.filter((el) => el.visible)"
          :key="tab.title"
          class="cursor-pointer py-4 px-1 flex items-center"
          @click="selectTab(tab.slug)"
          :class="{ 'border-b border-gray-500 text-blue-500': activeTab === tab.slug }"
        >
          <span v-html="tab.icon" class="pr-2"></span>
          <span
            v-html="tab.title"
            class="whitespace-nowrap text-sm font-medium"
            :class="{
              'text-gray-800 hover:text-gray-900': tab.slug === activeTab,
              'text-gray-500 hover:text-gray-700': tab.slug !== activeTab,
            }"
          ></span>
        </a>
      </nav>
    </div>

    <!-- Prompt bubbles -->
    <div class="mx-auto flex flex-wrap justify-center my-2">
      <span
        v-for="(prompt, index) in prompts"
        @click="handleSelectPrompt(prompt)"
        :key="index"
        class="cursor-pointer text-center inline-flex items-center mt-2 rounded-md bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 mr-2"
      >
        {{ prompt }}
      </span>
    </div>

    <!-- Messages list -->
    <div class="flex-1 overflow-y-auto px-4 pb-28">
    <TransitionGroup name="fade-slide" tag="div" class="space-y-4">
        <div v-for="(message, index) in defaultThreadMessages" :key="message.id || index" class="flex">
        <div class="ml-auto relative">
            <p class="bg-blue-500 text-white py-2 px-4 rounded-lg shadow">
            <span>{{ message.text }}</span>
            </p>
        </div>
        </div>
    </TransitionGroup>

    <span @click="() => triggerShuffle++" class="cursor-pointer flex items-center justify-center pt-4">
        <RefreshCcw class="size-4 text-gray-500" />
    </span>
    </div>

    <!-- Sticky input area -->
    <div class="w-full px-4 py-3 bg-white border-t sticky bottom-0 z-10">
      <div class="flex items-center gap-2">
        <!-- Input field -->
        <input
          v-model="message"
          @keyup.enter="handleSendMessage(message)"
          :placeholder="loading ? 'Se trimite întrebarea...' : 'Scrie ce cauți...'"
          class="w-full py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-0"
          type="text"
        />

        <!-- Send button -->
        <button
          @click="handleSendMessage(message)"
          :disabled="!message.trim() || loading"
          class="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-medium px-4 py-2 rounded-md transition"
        >
          Trimite
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePropertyQuestionStore } from '~/stores/propertyQuestionStore'
import { shuffleArray } from '../../utils'
import { RefreshCcw, MessageCircleQuestion } from 'lucide-vue-next'

const propertyQuestionStore = usePropertyQuestionStore()
const { loading } = storeToRefs(propertyQuestionStore)

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['select'])

const message = ref('')

const transactionType = computed(() => props.item.transaction_type)
const isForSale = computed(() => transactionType.value === 'for-sale')

const tabs = ref([
  {
    title: 'Sunt cumpărător',
    slug: 'buyer',
    visible: isForSale.value,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-500"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>',
  },
  // {
  //     title: "Sunt investor",
  //     slug: 'investor',
  //     visible: isForSale.value,
  //     icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-500"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>',
  // },
])

const activeTab = ref('buyer')

const triggerShuffle = ref(0)
const prompts = ref([])
watch(
  triggerShuffle,
  () => {
    prompts.value = shuffleArray(propertyQuestionStore.getPromptsByTab(activeTab.value)).slice(0, 5)
  },
  { immediate: true },
)

const defaultThreadMessages = computed(() => {
  return propertyQuestionStore.getMessagesByPropertyId(props.item.id)
})

const handleSendMessage = async (msg) => {
  const trimmedMessage = msg.trim()
  if (!trimmedMessage) return

  const { meta: { intent, amenities, nearby_places } = {} } =
    await propertyQuestionStore.sendQuestion({
        propertyId: props.item.id,
        question: trimmedMessage,
    })

  message.value = ''

  emit('select', amenities ? 'map' : 'general', amenities)
}

const handleSelectPrompt = (prompt) => {
  handleSendMessage(prompt)
}

const selectTab = (slug) => {
  activeTab.value = slug
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

