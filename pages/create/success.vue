<template>
    <div class="mx-auto max-w-lg mt-[10%]">
        <h2 class="text-base inline-flex font-semibold leading-6 text-gray-900"><Check class="mr-1" /> Succes!</h2>
        <p class="mt-1 text-sm text-gray-500">Anunțul dumneavoastră imobiliar a fost publicat cu succes. Mult noroc în găsirea unui cumpărător sau chiriaș!</p>
        <ul role="list" class="mt-6 divide-y divide-gray-200 border-b border-t border-gray-200">
            <li v-for="(item, itemIdx) in items" :key="itemIdx">
                <div class="group relative flex items-start space-x-3 py-4">
                    <div class="flex-shrink-0">
                        <span :class="[item.iconColor, 'inline-flex h-10 w-10 items-center justify-center rounded-lg']">
                            <component :is="item.icon" class="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-sm font-medium text-gray-900">
                            <RouterLink :to="item.href">
                                <span class="absolute inset-0" aria-hidden="true" />
                                {{ item.name }}
                            </RouterLink>
                        </div>
                        <p class="text-sm text-gray-500">{{ item.description }}</p>
                    </div>
                    <div class="flex-shrink-0 self-center">
                        <ChevronRightIcon class="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { CommandLineIcon, MegaphoneIcon } from '@heroicons/vue/24/outline'
import { Check } from "lucide-vue-next"

import { launchConfetti } from '~/utils';

onMounted(() => {
    launchConfetti()
})

const items = [
    {
        name: 'Adaugă o proprietate nouă',
        description: 'Continuă să adaugi alte proprietăți gratuit!',
        href: '/create',
        iconColor: 'bg-pink-500',
        icon: MegaphoneIcon,
    },
    {
        name: 'Vizualizează anunțurile tale',
        description: 'Vezi toate anunțurile publicate și gestionează-le cu ușurință.',
        href: '/view-listings',
        iconColor: 'bg-purple-500',
        icon: CommandLineIcon,
    },
]
</script>