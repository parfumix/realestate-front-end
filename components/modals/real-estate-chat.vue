<template>
    <div class="h-full">
        <Chat @submit="handleSendMessage" :isLoading="isQueryLoadingProperty" :messages="defaultThreadMessages">
            <template #header>
                <div class="bg-blue-500 text-white px-4 rounded-tl-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                    <h1 class="text-lg py-2 bg-blue-500 text-white font-semibold leading-6 pl-2">Pune orice întrebare</h1>
                </div>
            </template>

            <div>
                <div v-if="!defaultThreadMessages.length" class="border-b border-gray-200 mx-auto flex justify-center">
                    <nav class="-mb-px flex space-x-[12px]">
                        <a v-for="(tab, index) in tabs" :key="tab.title" class="cursor-pointer py-4 px-1 flex items-center" @click="selectTab(tab.slug)" :class="{ 'border-b border-gray-500 text-blue-500': activeTab === index }">
                            <span v-html="tab.icon" :class="[{'text-gray-800': tab.slug==activeTab, 'text-gray-500': tab.slug!=activeTab}, 'pr-2']"></span>
                            <span v-html="tab.title" :class="[{'text-gray-800 font-medium hover:text-gray-900': tab.slug==activeTab, 'text-gray-500 font-medium hover:text-gray-700': tab.slug!=activeTab}, 'whitespace-nowrap text-sm']"></span>
                        </a>
                    </nav>
                </div>

                <div class="mx-auto flex flex-wrap justify-center my-2">
                    <span v-for="(prompt, index) in activePrompts" @click="() => handleSelectPrompt(prompt)" :key="index" class="cursor-pointer text-center inline-flex items-center mt-2 rounded-md bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 mr-2">
                        {{ prompt }}
                    </span>
                </div>

                <span @click="getActivePrompts" class="cursor-pointer flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-gray-500"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                </span>
            </div>
        </Chat>
    </div>
</template>

<script setup>
import { useChatStore } from '@/stores/chat';
const chatStore = useChatStore()
const { isQueryLoadingProperty } = storeToRefs(chatStore)

const { insertMessage } = useUserMessages()
const { user } = useAuthService()

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
})

const emit = defineEmits(['select'])

const tabs = ref([
    {
        title: "Sunt cumpărător",
        slug: 'buyer',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-500"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>',
    },
    {
        title: "Sunt investor",
        slug: 'investor',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-500"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>',
    },
]);

const activeTab = ref('buyer');

let activePrompts = ref([])
const getActivePrompts = () => {
  let promptsByThread = chatStore.handleGetPromptsByThread(activeTab.value);

  // Function to shuffle the array
  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Shuffle the prompts
  let shuffledPrompts = shuffleArray([...promptsByThread]);

  // Return the first 5 items (or fewer if there are less than 5 prompts)
  activePrompts.value = shuffledPrompts.slice(0, 5);
};

onMounted(() => {
    getActivePrompts()
})

const defaultThreadMessages = computed(() => {
  return chatStore.handleGetMessagesByThread(props.item.id)
})

const handleSendMessage = async(message) => {
    try {
        let trimmedMessage = message.trim()
        if(! trimmedMessage) return

        // adding user message to stack
        chatStore.handlePushMessage(props.item.id, { text: message, sender: 'user' })

        const { reply = null, item, intent, amenities } = await chatStore.handleRequestDetails(props.item.id, trimmedMessage, {})
        if(! item) throw new Error('No results found for' + trimmedMessage)
        
        chatStore.handlePushMessage(props.item.id, { text: reply, sender: 'bot' })

        emit('select', amenities ? 'map' : 'general', amenities)

        insertMessage(
            user.value?.id, props.item.id, props.item.id, trimmedMessage, 'user'
        )
  } catch(err) {
    chatStore.handlePushMessage(props.item.id, {
      text: err,
      sender: 'bot',
    })
  }

};

const handleSelectPrompt = (prompt) => {
    handleSendMessage(prompt)
}

const selectTab = (slug) => {
    activeTab.value = slug;
    getActivePrompts()
}
</script>