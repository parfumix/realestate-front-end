import { useCustomFetch } from '~/composables/useCustomFetch'

export async function querySuggestions(term) {
    const { data, error } = await useCustomFetch('/query/autocomplete', {
        query: { term },
    })

    return { data, error };
}
