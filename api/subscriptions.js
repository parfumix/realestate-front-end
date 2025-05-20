import { useCustomFetch } from '~/composables/useCustomFetch'

export async function getUserSubscriptions() {
  const { data, error } = await useCustomFetch('/subscriptions')
  return { data, error }
}

export async function subscribeToQuery(query, notificationFrequency = 'daily', filters = null) {
  const { data, error } = await useCustomFetch('/subscriptions/subscribe', {
    method: 'POST',
    body: {
      query,
      notificationFrequency,
      filters
    }
  })
  return { data, error }
}

export async function unsubscribeFromQuery(query) {
  const { data, error } = await useCustomFetch('/subscriptions/unsubscribe', {
    method: 'DELETE',
    body: { query }
  })
  return { data, error }
}

export async function toggleSubscriptionPause(subscriptionId) {
  const { data, error } = await useCustomFetch(`/subscriptions/${subscriptionId}/toggle-pause`, {
    method: 'PATCH'
  })
  return { data, error }
}

export const unsubscribeByToken = async (token) => {
  const { data, error } = await useCustomFetch(`subscriptions/unsubscribe`, {
    method: 'GET',
    query: { token },
  })

  return { data, error }
}
