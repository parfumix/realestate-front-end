<template>
    <div>
        <FormTextareaActions
                id="description" 
                :required="true" 
                :maxLength="500"
                :rows="6"
                v-model="computedDescription" 
                :label="title"
                placeholder="Acest apartament modern cu 3 camere oferă finisaje de calitate superioară, spații luminoase și este situat într-o zonă centrală, aproape de toate facilitățile..."
                :error="errorMessage"
            >
                <template #left-actions>
                    <div></div>
                </template>
                <template #right-actions>
                    <div class="flex items-center">
                    <div class="mr-4 flex items-center space-x-4">
                        <p @click="handleDiscard" v-if="aiGeneratedDescription?.length && !isAiDescriptionGenerating" class="flex items-center cursor-pointer text-sm">
                        <Trash size="14" class="mr-1 text-red-800" /> Renunță
                        </p>
                        <p @click="handleApply" v-if="aiGeneratedDescription?.length && !isAiDescriptionGenerating" class="flex items-center cursor-pointer text-sm">
                        <Check size="14" class="mr-1 text-green-800" /> Aplică
                        </p>
                    </div>

                    <FormButtonDropdown
                        :disabled="(isAiDescriptionGenerating || value?.length < 7) ? true : false" 
                        :btnClass="generateDropDownClass"
                        @onClick="handleAutoGenerate"
                        @onSecondaryClick="handleSelectTone"
                        :options="toneItems"
                    >
                        <RefreshCcw size="14" :class="[{ 'animate-spin': isAiDescriptionGenerating }, 'mr-1 lucide lucide-rotate-ccw']" />
                        {{ isAiDescriptionGenerating ? 'Se generează' : (aiGeneratedDescription?.length ? 'Încercați din nou' : 'Generează cu AI') }}
                    </FormButtonDropdown>
                    </div>
            </template>
        </FormTextareaActions>
    </div>
</template>

<script setup>
import { Trash, Check, RefreshCcw } from 'lucide-vue-next'
import { useField } from 'vee-validate';
import * as yup from 'yup'

import { generateDescription } from '../../../api/create'

const props = defineProps({
    name: String,
    title: String,
});

const { value, errorMessage } = useField(() => props.name, yup.string().required('Descrierea este obligatorie').min(100, 'Este nevoie de minim 100 de caractere').max(500, 'Maximum 500 de caractere'));

const defaultTone = ref('professional')
const toneItems = computed(() => {
    return [
        { active: defaultTone.value == 'professional', value: 'professional', label: 'Ton Profesional', description: 'Descriere clară și bine structurată.' },
        { active: defaultTone.value == 'friendly', value: 'friendly', label: 'Ton Prietenos', description: 'Ton cald și accesibil.' },
        { active: defaultTone.value == 'luxury', value: 'luxury', label: 'Ton Lux', description: 'Elegant și exclusivist.' }
    ]
})

const isAiDescriptionGenerating = ref(false)
const aiGeneratedDescription = ref(null)
const isDescriptionDirty = ref(false)

const generateDropDownClass = computed(() => {
    if ((value?.value?.length < 7 || isAiDescriptionGenerating?.value) && !isDescriptionDirty.value) {
        return 'bg-gray-300 hover:bg-gray-350 text-gray-800';
    } else if ((value?.value.length >= 7 && !isAiDescriptionGenerating.value) && isDescriptionDirty.value) {
        return "bg-blue-700 hover:bg-blue-700 text-gray-200";
    }
    return '';
})

const setDescription = newValue => {
    value.value = newValue
}

const handleSelectTone = (value) => {
    defaultTone.value = value
}

const handleDiscard = () => {
    aiGeneratedDescription.value = null
}

const handleApply = () => {
    setDescription(aiGeneratedDescription.value)
    isDescriptionDirty.value = false
    aiGeneratedDescription.value = null
}

const computedDescription = computed(({
    get() {
        return aiGeneratedDescription.value?.length ? aiGeneratedDescription.value : value.value
    },
    set(newValue) {
        if (aiGeneratedDescription.value?.length) {
            aiGeneratedDescription.value = newValue
        } else {
            isDescriptionDirty.value = true
            setDescription(newValue)
        }
    }
}))

const handleAutoGenerate = async () => {
    try {
        if (!value.value?.length || value.value?.length < 7) return
        isAiDescriptionGenerating.value = true

        const { data } = await generateDescription({
            text: value.value,
            tone: defaultTone.value
        })
        aiGeneratedDescription.value = data?.value.text
    } catch (err) {
        // show erro message
    } finally {
        isAiDescriptionGenerating.value = false
        isDescriptionDirty.value = false
    }
}
</script>