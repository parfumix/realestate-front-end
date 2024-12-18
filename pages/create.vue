<template>
    <main class="flex flex-row space-x-2 ml-20">
        <div class="w-1/2">
            <div class="p-6 h-[20px]">
                <h1 class="text-xl font-semibold text-gray-900">Vindeți o proprietate?</h1>
                <p class="mt-1 text-sm text-gray-600">Urmează paşii, e mai simplu ca niciodată.</p>
            </div>

            <form @submit.prevent="onSubmit" class="no-scrollbar overflow-auto h-[calc(100vh-130px)] mt-[30px]">
                <div class="space-y-12 px-6 pb-6">
                    <div class="border-b border-gray-900/10 pb-12">
                        <!-- Property Type -->
                        <div class="mt-4">
                            <FormRadioGroupImage
                                title="Tipul de proprietate"
                                name="property-type"
                                :options="propertyTypeOptions"
                                v-model="propertyType"
                            />
                        </div>

                        <!-- Transaction Type -->
                        <div class="mt-4">
                            <FormRadioGroup legend="Tipul de tranzactie" name="transaction-type" :items="transactionTypeOptions" v-model="transactionType" />
                        </div>

                        <!-- Description -->
                        <div class="mt-4">
                            <FormTextarea id="description" name="description" v-model="computedDescription" label="Adăugați o descriere" placeholder="Acest apartament modern cu 3 camere oferă finisaje de calitate superioară, spații luminoase și este situat într-o zonă centrală, aproape de toate facilitățile..." :rows=3 :error="errors.description">
                                <div class="flex flex-row my-2 justify-between">
                                    <FormDropdown
                                        @click="handleSelectTone"
                                        :defaultItem="defaultTone"
                                        :buttonLabel="defaultTone ? (toneItems.find(el => el.value == defaultTone )?.label ?? 'Alege tonul') : 'Alege tonul'"
                                        :menuItems="toneItems"
                                    />

                                   <div class="flex items-center">
                                      <div class="mr-4 flex items-center space-x-2">
                                        <p @click="handleDiscard" v-if="aiGeneratedDescription?.length && !isAiDescriptionGenerating" class="flex items-center cursor-pointer">
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash size-3 mr-1"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                          Discard
                                        </p>
                                        <p @click="handleApply" v-if="aiGeneratedDescription?.length && !isAiDescriptionGenerating" class="flex items-center cursor-pointer">
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-3 mr-1"><path d="M20 6 9 17l-5-5"/></svg>
                                          Apply
                                        </p>
                                      </div>

                                      <FormButton :disabled="(isAiDescriptionGenerating || aiGeneratedDescription?.length) ? true : false" @onClick="handleAutoGenerate" v-if="description?.length > 7" class="flex items-center" :backgroundColor="description?.length < 7 ? 'bg-gray-200' : 'bg-blue-600'">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="[{'animate-spin': isAiDescriptionGenerating}, 'mr-1 lucide lucide-rotate-ccw size-3']"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                        Completează cu AI
                                      </FormButton>
                                   </div>
                                </div>
                            </FormTextarea>
                        </div>

                        <!-- Facilities -->
                        <p @click="isFacilitiesCollpased = !isFacilitiesCollpased" class="cursor-pointer flex items-center">
                          <span>Facilitati</span>
                          <svg v-if="isFacilitiesCollpased" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right size-4"><path d="m9 18 6-6-6-6"/></svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down size-4"><path d="m6 9 6 6 6-6"/></svg>
                        </p>
                        <div v-if="! isFacilitiesCollpased" class="mt-4 flex justify-start">
                          <div class="" v-for="items in chunkArray(facilities, 5)">
                            <FormCheckbox
                                :collapsible="true"
                                :options="items"
                                v-model="selectedFacilities"
                            />
                          </div>
                        </div>

                        <!-- Image Upload -->
                        <div class="mt-4">
                            <FormFileUpload id="upload" :accept="'image/png, image/jpeg'" :multiple="true"
                                :maxFileSize="5 * 1024 * 1024" acceptText="PNG or JPG, smaller than 5MB"
                                @files-selected="handleFiles" />
                        </div>

                        <!-- Rooms and Details -->
                        <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                            <FormInput id="floor" name="floor" label="Etaj" placeholder="Etaj 7" v-model="floor"
                                :error="errors.floor" />
                            <FormInput id="surface" name="surface" label="Suprafață utilă" placeholder="mp"
                                v-model="surface" :error="errors.surface" />
                        </div>

                        <!-- Contact Details -->
                        <div class="mt-4">
                            <FormInput id="email" name="email" label="Email" placeholder="Email" type="email" v-model="email" :error="errors.email" />
                            <FormInput id="phone" name="phone" label="Telefon" placeholder="Telefon" v-model="phone" :error="errors.phone" />
                        </div>
                    </div>
                </div>
            </form>

            <div class="h-[40px] my-[5px] flex justify-end gap-4">
                <FormButton text="Salvează" @onClick="onSubmit" />
            </div>
        </div>

        <div class="w-1/2">
            <AdMap class="w-full h-full" />
        </div>
    </main>
</template>

<script setup>
//TODO adding autogenerate usingAI for description - https://ctrl.vi/i/YFMPc7vVA
//TODO adding moderation - https://chatgpt.com/share/6756fcb7-6464-8006-9453-d5f41b730e1e
//TODO https://preline.co//docs/confetti.html

import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

import { chunkArray } from '../utils';
import { generateDescription } from '../api/create'

const propertyTypeOptions = [
  {
    title: "Apartament",
    description: "Ideal for city living",
    value: "apartment",
    svg: `
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <path d="M3 9h18M9 21V9"></path>
      </svg>
    `,
  },
  {
    title: "Casă",
    description: "For families",
    value: "casa",
    svg: `
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    `,
  },
  {
    title: "Comercial",
    description: "Best for business",
    value: "comercial",
    svg: `
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 3h18v18H3z"></path>
        <path d="M9 3v18"></path>
        <path d="M3 9h18"></path>
      </svg>
    `,
  },
];

const transactionTypeOptions = [
  { value: 'sell', title: 'De vânzare' },
  { value: 'rent', title: 'De închiriat' },
]

const facilities = [
  { id: 'ready_to_move_in', label: 'Gata de mutat' },
  { id: 'annex', label: 'Anexă' },
  { id: 'terrace', label: 'Terasă' },
  { id: 'separate_entrance', label: 'Intrare separată' },
  { id: 'park_area', label: 'Zonă cu parc' },
  { id: 'furnished', label: 'Mobilat' },
  { id: 'household_appliances', label: 'Cu tehnică electrocasnică' },
  { id: 'autonomous_heating', label: 'Încălzire autonomă' },
  { id: 'air_conditioning', label: 'Aparat de aer condiționat' },
  { id: 'heated_floor', label: 'Podea cu încălzire' },
  { id: 'double_glazed_windows', label: 'Geamuri termopan' },
  { id: 'panoramic_windows', label: 'Geamuri panoramice' },
  { id: 'parquet', label: 'Parchet' },
  { id: 'laminate', label: 'Laminat' },
  { id: 'reinforced_door', label: 'Ușă blindată' },
  { id: 'phone_line', label: 'Linie telefonică' },
  { id: 'smart_home', label: 'Sistem "casă inteligentă"' },
  { id: 'intercom', label: 'Interfon' },
  { id: 'internet', label: 'Internet' },
  { id: 'cable_tv', label: 'Cablu TV' },
  { id: 'alarm_system', label: 'Sistem de alarmă' },
  { id: 'video_surveillance', label: 'Supraveghere video' },
  { id: 'elevator', label: 'Ascensor' },
  { id: 'playground', label: 'Teren de joacă' },
];

const toneItems = [
  { value: 'professional', label: 'Ton Profesional', description: 'Descriere clară și bine structurată.' },
  { value: 'friendly', label: 'Ton Prietenos', description: 'Ton cald și accesibil.' },
  { value: 'luxury', label: 'Ton Lux', description: 'Elegant și exclusivist.' }
]

const propertyType = ref('apartment');
const transactionType = ref('sell');
const defaultTone = ref('professional')

const selectedFacilities = ref([]);
const isFacilitiesCollpased = ref(true)

const schema = yup.object({
  description: yup.string().required('Descrierea este obligatorie').max(500),
  floor: yup.number().typeError('Trebuie să fie un număr').required(),
  surface: yup.number().typeError('Trebuie să fie un număr').required(),
  email: yup.string().email().required(),
  phone: yup.string().matches(/^\d{10}$/).required(),
});

const { handleSubmit, errors } = useForm({ validationSchema: schema });
const onSubmit = handleSubmit((values) => {
  console.log('Submitted:', values);
});

const { value: description, setValue: setDescription } = useField('description');
const { value: floor } = useField('floor');
const { value: surface } = useField('surface');
const { value: email } = useField('email');
const { value: phone } = useField('phone');


const handleSelectTone = ({ value }) => {
  defaultTone.value = value
} 

const handleFiles = (files) => {
  console.log('Selected files:', files);
};

const handleDiscard = () => {
  aiGeneratedDescription.value = null
}

const handleApply = () => {
  setDescription(aiGeneratedDescription.value)
  aiGeneratedDescription.value = null
}

const computedDescription = computed(({
  get(pervious) {
    return aiGeneratedDescription.value?.length ? aiGeneratedDescription.value : description.value
  },
  set(newValue) {
    if(aiGeneratedDescription.value?.length) {
      aiGeneratedDescription.value = newValue
    } else {
      setDescription(newValue)
    }
  }
}))

const isAiDescriptionGenerating = ref(false)
const aiGeneratedDescription = ref(null)
const handleAutoGenerate = async() => {
  try {
    if(aiGeneratedDescription.value?.length) return
    isAiDescriptionGenerating.value = true

    const { data } = await generateDescription({
      text: description.value,
      tone: defaultTone.value
    })
    aiGeneratedDescription.value = data?.value.text
  } catch(err) {
    // show erro message
  } finally {
    setTimeout(() => isAiDescriptionGenerating.value = false, 300)
    
  }
}
</script>
