import { useCustomFetch } from '~/composables/useCustomFetch'

export async function querySuggestions(term, limit = 15) {
    const { data, error } = await useCustomFetch('/query/autocomplete', {
        query: { term, limit },
    });
    return { data, error };
}

export async function getPopularQueries(limit = 10) {
    const { data, error } = await useCustomFetch('/query/popular', {
        query: { limit },
    });
    return { data, error };
}

export async function getRecentQueries(limit = 10) {
    const { data, error } = await useCustomFetch('/query/recent', {
        query: { limit },
    });
    return { data, error };
}

export async function getCombinedQueries(limit = 10) {
    const { data, error } = await useCustomFetch('/query/queries', {
        query: { limit },
    });
    return { data, error };
}
