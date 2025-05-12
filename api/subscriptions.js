import { useCustomFetch } from '~/composables/useCustomFetch'

export async function getUserSubscriptions() {
  const { data, error } = await useCustomFetch('/query/subscriptions')
  return { data, error }
}

export async function subscribeToQuery(query, notificationFrequency = 'daily', filters = null) {
  const { data, error } = await useCustomFetch('/query/subscribe', {
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
  const { data, error } = await useCustomFetch('/query/unsubscribe', {
    method: 'DELETE',
    body: { query }
  })
  return { data, error }
}

export async function toggleSubscriptionPause(subscriptionId) {
  const { data, error } = await useCustomFetch(`/query/subscriptions/${subscriptionId}/toggle-pause`, {
    method: 'PATCH'
  })
  return { data, error }
}