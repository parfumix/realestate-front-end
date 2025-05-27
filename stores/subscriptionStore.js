import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserSubscriptions,
  subscribeToQuery,
  unsubscribeFromQuery,
  toggleSubscriptionPause,
  unsubscribeByToken as unsubscribeByTokenApi,
} from '~/api/subscriptions'

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscriptions = ref([])
  const isLoading = ref(false)
  const isSaving = ref(false)

  const isSubscribedToQuery = (normalized_query) => {
    return subscriptions.value.some((sub) => {
      return sub.searchQuery?.normalized_query === normalized_query
    })
  }

  const fetchSubscriptions = async () => {
    isLoading.value = true

    try {
      const { data, error: fetchError } = await getUserSubscriptions()
      if (fetchError.value) throw fetchError

      subscriptions.value = data?.value?.subscriptions || []
    } catch (err) {
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const subscribe = async (query, notificationFrequency = 'daily', filters = null) => {
    isSaving.value = true

    try {
      const { data, error: subscribeError } = await subscribeToQuery(
        query,
        notificationFrequency,
        filters,
      )
      if (subscribeError.value) throw subscribeError

      subscriptions.value.push(data?.value?.subscription)
      return data?.value?.subscription
    } catch (err) {
      throw err
    } finally {
      isSaving.value = false
    }
  }

  const unsubscribe = async (query) => {
    isSaving.value = true

    try {
      const { error: unsubscribeError } = await unsubscribeFromQuery(query)
      if (unsubscribeError.value) throw unsubscribeError

      subscriptions.value = subscriptions.value.filter(
        (sub) => sub.searchQuery.normalized_query !== query,
      )
    } catch (err) {
      throw err
    } finally {
      isSaving.value = false
    }
  }

  const unsubscribeByToken = async (token) => {
    try {
      const { error: unsubscribeError } = await unsubscribeByTokenApi(token)
      if (unsubscribeError.value) throw unsubscribeError
    } catch (err) {
      throw err
    } finally {
      //
    }
  }

  const togglePause = async (subscriptionId) => {
    isSaving.value = true
    try {
      const { data, error: toggleError } = await toggleSubscriptionPause(subscriptionId)
      if (toggleError) throw toggleError

      const updated = data?.value?.subscription
      const index = subscriptions.value.findIndex((sub) => sub.id === updated.id)
      if (index !== -1) {
        subscriptions.value[index] = updated
      }

      return updated
    } catch (err) {
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return {
    subscriptions,
    isLoading,
    isSaving,
    fetchSubscriptions,
    subscribe,
    unsubscribe,
    togglePause,
    isSubscribedToQuery,
    unsubscribeByToken,
  }
})
