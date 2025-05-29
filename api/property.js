import { useCustomFetch } from '~/composables/useCustomFetch'

export const askQuestion = async (uuid, question) => {
  const { data, error } = await useCustomFetch(`property-questions/ask/${uuid}`, {
    method: 'POST',
    body: JSON.stringify({ question }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return { data, error }
}

export const getQuestions = async (uuid) => {
  const { data, error } = await useCustomFetch(`property-questions/list/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return { data, error }
}
