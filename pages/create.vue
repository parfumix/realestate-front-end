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
                                v-model="propertyType"
                                :options="propertyTypeOptions"
                                :error="errors.propertyType" 
                            />
                        </div>

                        <!-- Transaction Type -->
                        <div class="mt-4">
                            <FormRadioGroup 
                              legend="Tipul de tranzactie" 
                              name="transaction-type" 
                              :items="transactionTypeOptions" 
                              v-model="transactionType" 
                              :error="errors.transactionType"  
                            />
                        </div>

                        <!-- Description -->
                        <div class="mt-4">
                            <FormTextarea :maxLength="500" id="description" name="description" :rows="6" v-model="computedDescription" label="Adăugați o descriere" placeholder="Acest apartament modern cu 3 camere oferă finisaje de calitate superioară, spații luminoase și este situat într-o zonă centrală, aproape de toate facilitățile..." :error="errors.description">
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

                                      <FormButton :disabled="(isAiDescriptionGenerating) ? true : false" @onClick="handleAutoGenerate" v-if="description?.length > 7" class="flex items-center" :backgroundColor="description?.length < 7 ? 'bg-gray-200' : 'bg-blue-600'">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="[{'animate-spin': isAiDescriptionGenerating}, 'mr-1 lucide lucide-rotate-ccw size-3']"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                        {{ aiGeneratedDescription?.length ? 'Mai incearca' : 'Completează cu AI'}}
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
                          <div v-for="items in chunkArray(facilities, 5)">
                            <FormCheckbox
                                :collapsible="true"
                                :options="items"
                                v-model="selectedFacilities"
                            />
                          </div>
                        </div>

                        <!-- Image Upload -->
                        <div class="mt-4">
                          <FormFileUpload
                            id="upload"
                            :accept="'image/png, image/jpeg'"
                            :multiple="true"
                            :maxFileSize="5 * 1024 * 1024"
                            acceptText="PNG or JPG, smaller than 5MB"
                            v-model="images"
                            :error="errors.images"
                          />
                        </div>

                        <!-- Rooms and Details -->
                        <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                            <FormSelect id="floor" name="floor" label="Etaj" placeholder="Etaj 7" v-model="floor" :error="errors.floor" />
                            <FormInput id="surface" name="surface" label="Suprafață utilă" placeholder="mp" v-model="surface" :error="errors.surface" />
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
    value: "home",
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
  { value: 'ready_to_move_in', label: 'Gata de mutat' },
  { value: 'annex', label: 'Anexă' },
  { value: 'terrace', label: 'Terasă' },
  { value: 'separate_entrance', label: 'Intrare separată' },
  { value: 'park_area', label: 'Zonă cu parc' },
  { value: 'furnished', label: 'Mobilat' },
  { value: 'with_household_appliances', label: 'Cu tehnică electrocasnică' },
  { value: 'autonomous_heating', label: 'Încălzire autonomă' },
  { value: 'air_conditioning', label: 'Aparat de aer condiționat' },
  { value: 'heated_floor', label: 'Podea cu încălzire' },
  { value: 'double_glazed_windows', label: 'Geamuri termopan' },
  { value: 'panoramic_windows', label: 'Geamuri panoramice' },
  { value: 'parquet', label: 'Parchet' },
  { value: 'laminate', label: 'Laminat' },
  { value: 'reinforced_door', label: 'Ușă blindată' },
  { value: 'phone_line', label: 'Linie telefonică' },
  { value: 'smart_home_system', label: 'Sistem "casă inteligentă"' },
  { value: 'intercom', label: 'Interfon' },
  { value: 'internet', label: 'Internet' },
  { value: 'cable_tv', label: 'Cablu TV' },
  { value: 'alarm_system', label: 'Sistem de alarmă' },
  { value: 'video_surveillance', label: 'Supraveghere video' },
  { value: 'elevator', label: 'Ascensor' },
  { value: 'playground', label: 'Teren de joacă' },
];

const toneItems = [
  { value: 'professional', label: 'Ton Profesional', description: 'Descriere clară și bine structurată.' },
  { value: 'friendly', label: 'Ton Prietenos', description: 'Ton cald și accesibil.' },
  { value: 'luxury', label: 'Ton Lux', description: 'Elegant și exclusivist.' }
]
const defaultTone = ref('professional')
const isFacilitiesCollpased = ref(true)

const schema = yup.object({
  // transaction type
  propertyType: yup.mixed().oneOf(['apartment', 'home', 'comercial']),
  transactionType: yup.mixed().oneOf(['sell', 'rent']),
  selectedFacilities: yup.string().optional(),

  // characteristics
  description: yup.string().required('Descrierea este obligatorie').max(500),
  floor: yup.number().typeError('Trebuie să fie un număr').required(),
  surface: yup.number().typeError('Trebuie să fie un număr').required(),


  images: yup.array()
    .of(
      yup.mixed().test('fileType', 'Only PNG and JPEG files are allowed', (value) => {
        return value && ['image/png', 'image/jpeg'].includes(value.type);
      })
      .test('fileSize', 'File size must be less than 5MB', (value) => {
        return value && value.size <= 5 * 1024 * 1024; // 5MB
      })
    )
    .required('At least one image is required'),

  // contat section
  email: yup.string().email().required(),
  phone: yup.string().matches(/^\d{10}$/).required(),
});

const { handleSubmit, errors } = useForm({ validationSchema: schema, initialValues: {
  propertyType: 'apartment',
  transactionType: 'sell',
} });
const onSubmit = handleSubmit((values) => {
  console.log('Submitted:', values);
});

const { value: propertyType } = useField('propertyType');
const { value: transactionType } = useField('transactionType');
const { value: selectedFacilities } = useField('selectedFacilities');

const { value: images } = useField('images');
const { value: description, setValue: setDescription } = useField('description');
const { value: floor } = useField('floor');
const { value: surface } = useField('surface');

const { value: email } = useField('email');
const { value: phone } = useField('phone');

const handleSelectTone = ({ value }) => {
  defaultTone.value = value
} 
const handleDiscard = () => {
  aiGeneratedDescription.value = null
}

const handleApply = () => {
  setDescription(aiGeneratedDescription.value)
  aiGeneratedDescription.value = null
}

const computedDescription = computed(({
  get() {
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
    isAiDescriptionGenerating.value = true

    const { data } = await generateDescription({
      text: description.value,
      tone: defaultTone.value
    })
    aiGeneratedDescription.value = data?.value.text
  } catch(err) {
    // show erro message
  } finally {
    isAiDescriptionGenerating.value = false
  }
}
</script>
