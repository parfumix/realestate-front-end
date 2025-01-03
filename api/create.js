import { useCustomFetch } from '~/composables/useCustomFetch'

const generateDescription = async({text, tone}) => {
  const { data, error } = await useCustomFetch(`ai/generate-description`, {
    method: 'POST',
    body: JSON.stringify({ text, tone }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return { data, error }
}

export {
    generateDescription
}
