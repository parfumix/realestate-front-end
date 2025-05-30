/* eslint-disable no-useless-catch */
// stores/useSendPropertyQuestionStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { askQuestion as askQuestionApi, getQuestions as getQuestionsApi } from '../api/property'

export const usePropertyQuestionStore = defineStore('propertyQuestion', () => {
  const loading = ref(false)
  const messages = ref([])

  // Unified prompts by thread name
  const prompts = ref({
    default: [
      'Apartamente cu 2 dormitoare aproape de centru',
      'Case cu grădină în București',
      'Apartamente moderne în București cu parcare',
      'Proprietăți comerciale de vânzare în București',
      'Proprietăți de închiriat disponibile în București',
    ],
    buyer: [
      'Cât de aproape este de transportul public?',
      'Există școli sau spitale în apropiere?',
      'Care sunt cele mai apropiate centre comerciale?',
      'Care sunt cele mai apropiate parcuri?',
      'Este inclus un loc de parcare?',
    ],
    // investor: [
    //   'Care este randamentul chiriei?',
    //   'Care a fost rata istorică de apreciere din această zonă?',
    //   'Care este venitul mediu lunar din chirie?',
    //   'Cât de stabilă este piața de închiriere din această zonă?',
    // ],
  })

  const sendQuestion = async ({ propertyId, question }) => {
    loading.value = true
    try {
      const { data, error } = await askQuestionApi(propertyId, question)
      if (error.value) throw new Error(error.value)

      return data.value?.data
    } finally {
      loading.value = false
    }
  }

  const fetchMessages = async (propertyId) => {
    loading.value = true
    try {
      const { data, error } = await getQuestionsApi(propertyId)
      if (error.value) throw new Error(error.value)

      const result = data.value?.data || []

      return result
    } finally {
      loading.value = false
    }
  }

  const addMessage = (propertyId, message) => {
    if (!messages.value[propertyId]) {
      messages.value[propertyId] = []
    }
    messages.value[propertyId].push(message)
  }

  const getMessagesByPropertyId = (propertyId) => {
    if (!propertyId) return []
    return messages.value[propertyId] || []
  }

  const getPromptsByTab = (tabName) => {
    return prompts.value[tabName] || []
  }

  return {
    // State
    loading,
    prompts,

    // Prompt utilities
    getPromptsByTab,

    // Messages
    messages,
    addMessage,
    getMessagesByPropertyId,

    // API
    sendQuestion,
    fetchMessages,
  }
})
