<template>
  <main class="flex flex-row space-x-2 ml-20">
    <div class="w-1/2 flex">

      <div class="w-5/6">
        <div class="p-6 h-[20px]">
          <h1 class="text-xl font-semibold text-gray-900">Vindeți o proprietate?</h1>
          <p class="mt-1 text-sm text-gray-600">Urmează paşii, e mai simplu ca niciodată.</p>
        </div>

        <form @submit.prevent="onSubmit" class="no-scrollbar overflow-auto h-[calc(100vh-130px)] mt-[30px]">
          <div class="space-y-12 px-6 pb-6">
            <div class="border-b border-gray-900/10 pb-12">
              <!-- Property Type -->
              <div class="mt-4">
                <FormRadioGroupImage :title="fieldLabels['propertyType'].long" name="property-type" v-model="propertyType"
                  :options="propertyTypeOptions" :error="errors.propertyType" />
              </div>

              <!-- Transaction Type -->
              <div class="mt-4">
                <FormRadioGroup :legend="fieldLabels['transactionType'].long" name="transaction-type" :options="transactionTypeOptions"
                  v-model="transactionType" :error="errors.transactionType" />
              </div>

              <!-- Description -->
              <div class="mt-4">
                <FormTextarea :maxLength="500" id="description" name="description" :rows="6"
                  v-model="computedDescription" :label="fieldLabels['description'].long"
                  placeholder="Acest apartament modern cu 3 camere oferă finisaje de calitate superioară, spații luminoase și este situat într-o zonă centrală, aproape de toate facilitățile..."
                  :error="errors.description">
                  <div class="flex flex-row my-2 justify-between">
                    <FormDropdown @click="handleSelectTone" :defaultItem="defaultTone"
                      :buttonLabel="defaultTone ? (toneItems.find(el => el.value == defaultTone)?.label ?? 'Alege tonul') : 'Alege tonul'"
                      :menuItems="toneItems" />

                    <div class="flex items-center">
                      <div class="mr-4 flex items-center space-x-2">
                        <p @click="handleDiscard" v-if="aiGeneratedDescription?.length && !isAiDescriptionGenerating"
                          class="flex items-center cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-trash size-3 mr-1">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          Discard
                        </p>
                        <p @click="handleApply" v-if="aiGeneratedDescription?.length && !isAiDescriptionGenerating"
                          class="flex items-center cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-check size-3 mr-1">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Apply
                        </p>
                      </div>

                      <FormButton :disabled="(isAiDescriptionGenerating) ? true : false" @onClick="handleAutoGenerate"
                        v-if="description?.length > 7" class="flex items-center"
                        :backgroundColor="description?.length < 7 ? 'bg-gray-200' : 'bg-blue-600'">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          :class="[{ 'animate-spin': isAiDescriptionGenerating }, 'mr-1 lucide lucide-rotate-ccw size-3']">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                        </svg>
                        {{ aiGeneratedDescription?.length ? 'Mai incearca' : 'Completează cu AI' }}
                      </FormButton>
                    </div>
                  </div>
                </FormTextarea>
              </div>

              <!-- Facilities -->
              <p @click="isFacilitiesCollpased = !isFacilitiesCollpased" class="cursor-pointer flex items-center">
                <span>Facilitati</span>
                <svg v-if="isFacilitiesCollpased" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="lucide lucide-chevron-right size-4">
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="lucide lucide-chevron-down size-4">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </p>
              <div v-if="!isFacilitiesCollpased" class="mt-4 flex justify-start">
                <div v-for="items in chunkArray(facilities, 5)">
                  <FormCheckbox :collapsible="true" :options="items" v-model="selectedFacilities" />
                </div>
              </div>

              <!-- Image Upload -->
              <div class="mt-4">
                <FormFileUpload id="images" :accept="'image/png, image/jpeg'" :multiple="true"
                  :maxFileSize="5 * 1024 * 1024" acceptText="PNG or JPG, smaller than 5MB" v-model="images"
                  :error="errors.images" />
              </div>

              <!-- Rooms and Details -->
              <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                <FormSelect id="roomCount" name="roomCount" :options="roomCountOptions" :label="fieldLabels['roomCount'].long"
                  placeholder="Select" v-model="roomCount" :error="errors.roomCount" />

                <FormInput id="totalArea" name="totalArea" :label="fieldLabels['totalArea'].long" placeholder="mp" v-model="totalArea"
                  :error="errors.totalArea" />

                <FormInput id="surface" name="surface" :label="fieldLabels['surface'].long" placeholder="mp" v-model="surface"
                  :error="errors.surface" />

                <FormSelect id="floor" name="floor" :options="floorOptions" :label="fieldLabels['floor'].long" placeholder="Select"
                  v-model="floor" :error="errors.floor" />

                <FormSelect id="balcony" name="balcony" :options="balconyOptions" :label="fieldLabels['balcony'].long"
                  placeholder="Select" v-model="balcony" :error="errors.balcony" />

                <FormSelect id="parking" name="parking" :options="parkingOptions" :label="fieldLabels['parking'].long"
                  placeholder="Select" v-model="parking" :error="errors.parking" />

                <FormSelect id="apartmentCondition" name="apartmentCondition" :options="apartmentConditionOptions"
                  :label="fieldLabels['apartmentCondition'].long" placeholder="Select" v-model="apartmentCondition" :error="errors.apartmentCondition" />

                <FormInput id="livingArea" name="livingArea" :label="fieldLabels['livingArea'].long" placeholder="mp"
                  v-model="livingArea" :error="errors.livingArea" />
              </div>

              <!-- Contact Details -->
              <div class="mt-4">
                <FormInput id="email" name="email" :label="fieldLabels['email'].long" placeholder="Email" type="email" v-model="email"
                  :error="errors.email" />
                <FormInput id="phone" name="phone" :label="fieldLabels['phone'].long" placeholder="Telefon" v-model="phone"
                  :error="errors.phone" />
              </div>
            </div>
          </div>
        </form>

        <div class="h-[40px] my-[5px] flex justify-end gap-4">
          <FormButton :disabled="isSubmitting" text="Salvează" @onClick="onSubmit" />
        </div>
      </div>

      <div class="w-1/6 flex justify-center items-center">
        <CreateTimeline class="my-8 overflow-hidden" :fields="fieldStatuses" />
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

const { user } = useAuthService()

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
]

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
]

const toneItems = [
  { value: 'professional', label: 'Ton Profesional', description: 'Descriere clară și bine structurată.' },
  { value: 'friendly', label: 'Ton Prietenos', description: 'Ton cald și accesibil.' },
  { value: 'luxury', label: 'Ton Lux', description: 'Elegant și exclusivist.' }
]

const floorOptions = [
  { "value": "-2", "label": "Subsol" },
  { "value": "-1", "label": "Demisol" },
  { "value": "1", "label": "1" },
  { "value": "2", "label": "2" },
  { "value": "3", "label": "3" },
  { "value": "4", "label": "4" },
  { "value": "5", "label": "5" },
  { "value": "6", "label": "6" },
  { "value": "7", "label": "7" },
  { "value": "8", "label": "8" },
  { "value": "9", "label": "9" },
  { "value": "10", "label": "10" },
  { "value": "11", "label": "11" },
  { "value": "12", "label": "12" },
  { "value": "13", "label": "13" },
  { "value": "14", "label": "14" },
  { "value": "15", "label": "15" },
  { "value": "16", "label": "16" },
  { "value": "17", "label": "17" },
  { "value": "18", "label": "18" },
  { "value": "19", "label": "19" },
  { "value": "20", "label": "20" },
  { "value": "21", "label": "21" },
  { "value": "22", "label": "22" },
  { "value": "23", "label": "23" },
  { "value": "24", "label": "24" },
  { "value": "25", "label": "25" },
  { "value": "penthouse", "label": "Penthouse" },
  { "value": "attic", "label": "Mansardă" }
]

const roomCountOptions = [
  { "value": "1", "label": "O cameră" },
  { "value": "1", "label": "Apartament cu 1 cameră" },
  { "value": "2", "label": "Apartament cu 2 camere" },
  { "value": "3", "label": "Apartament cu 3 camere" },
  { "value": "4", "label": "Apartament cu 4 camere" },
  { "value": "5", "label": "Apartament cu 5 camere sau mai multe" }
]

const parkingOptions = [
  { "value": "open", "label": "Deschis" },
  { "value": "garage", "label": "Garaj" },
  { "value": "covered", "label": "Sub acoperiș" },
  { "value": "underground", "label": "Subterană" }
]

const balconyOptions = [
  { "value": "0", "label": "Nu" },
  { "value": "1", "label": "1" },
  { "value": "2", "label": "2" },
  { "value": "3", "label": "3" },
  { "value": "4", "label": "4 și mai multe" }
]

const apartmentConditionOptions = [
  { "value": "demolition-house", "label": "Casă de demolat" },
  { "value": "custom-design", "label": "Design individual" },
  { "value": "no-renovation", "label": "Fără reparație" },
  { "value": "in-use", "label": "Dat în exploatare" },
  { "value": "unfinished-construction", "label": "Construcție nefinisată" },
  { "value": "needs-repair", "label": "Are nevoie de reparație" },
  { "value": "gray-finish", "label": "Variantă sură" },
  { "value": "white-finish", "label": "Variantă albă" },
  { "value": "cosmetic-renovation", "label": "Reparație cosmetică" },
  { "value": "euro-renovation", "label": "Euroreparație" }
]

const fieldLabels = {
  propertyType: {
    short: "Tip propr.",
    long: "Tipul de proprietate",
  },
  transactionType: {
    short: "Tip tranz.",
    long: "Tipul de tranzacție",
  },
  description: {
    short: "Descr.",
    long: "Descriere",
  },
  selectedFacilities: {
    short: "Facilități",
    long: "Facilități",
  },
  images: {
    short: "Img.",
    long: "Imagini",
  },
  roomCount: {
    short: "Nr. camere",
    long: "Număr de camere",
  },
  totalArea: {
    short: "Sup. totală",
    long: "Suprafață totală",
  },
  surface: {
    short: "Sup. utilă",
    long: "Suprafață utilă",
  },
  floor: {
    short: "Etaj",
    long: "Etaj",
  },
  balcony: {
    short: "Balcon",
    long: "Balcon/lojie",
  },
  parking: {
    short: "Parcare",
    long: "Loc de parcare",
  },
  apartmentCondition: {
    short: "Stare ap.",
    long: "Starea apartamentului",
  },
  livingArea: {
    short: "Sup. loc.",
    long: "Suprafață locativă",
  },
  email: {
    short: "Email",
    long: "Email",
  },
  phone: {
    short: "Tel.",
    long: "Telefon",
  },
};

const defaultTone = ref('professional')
const isFacilitiesCollpased = ref(true)

const schema = yup.object({
  // transaction type
  propertyType: yup.mixed().oneOf(['apartment', 'home', 'comercial']),
  transactionType: yup.mixed().oneOf(['sell', 'rent']),
  selectedFacilities: yup.string().optional(),

  description: yup.string().required('Descrierea este obligatorie').min(100, 'cel putin 100 caractere').max(500, 'maximum 500 caractere'),
  images: yup
    .array()
    .of(
      yup
        .mixed()
        .test('fileType', 'Only PNG and JPEG files are allowed', (value) => {
          return value.file && ['image/png', 'image/jpeg'].includes(value.file.type);
        })
        .test('fileSize', 'File size must be less than 5MB', (value) => {
          return value.file && value.file.size <= 5 * 1024 * 1024; // 5MB
        })
    )
    .required('At least one image is required'),

  // characteristics
  roomCount: yup
    .number()
    .typeError('Numărul de camere trebuie să fie un număr')
    .required('Numărul de camere este obligatoriu'),
  
  totalArea: yup.number().typeError('Trebuie să fie un număr').required('Suprafața totală este obligatorie'),
  livingArea: yup.number().typeError('Trebuie să fie un număr').optional(),
  floor: yup.number().typeError('Trebuie să fie un număr').required('Etajul este obligatoriu'),
  surface: yup.number().typeError('Trebuie să fie un număr').required('Suprafața utilă este obligatorie'),
  
  balcony: yup
    .number()
    .typeError('Numărul de balcoane trebuie să fie un număr')
    .optional(),
  parking: yup
    .mixed()
    .oneOf(['open', 'garage', 'covered', 'underground'])
    .optional(),
  apartmentCondition: yup
    .mixed()
    .oneOf([
      'demolition-house',
      'custom-design',
      'no-renovation',
      'in-use',
      'unfinished-construction',
      'needs-repair',
      'gray-finish',
      'white-finish',
      'cosmetic-renovation',
      'euro-renovation',
    ])
    .optional(),

  // contact section
  email: yup.string().email('Emailul este invalid').required('Emailul este obligatoriu'),
  phone: yup
    .string()
    .matches(
      /^(07\d{8}|02\d{7}|03\d{7})$/,
      'Numărul de telefon trebuie să fie valid și să aibă 10 cifre'
    )
    .required('Numărul de telefon este obligatoriu'),
});

const { handleSubmit, errors, isSubmitting, values } = useForm({
  validationSchema: schema, initialValues: {
    propertyType: 'apartment',
    transactionType: 'sell',
    selectedFacilities: [],
    description: '',
    images: [],
    roomCount: '',
    totalArea: '',
    surface: '',
    floor: '',
    balcony: '',
    parking: '',
    apartmentCondition: '',
    livingArea: '',
    email: user.value.email,
    phone: '',
  }
});

const onSubmit = handleSubmit((values) => {
  console.log('Submitted:', values);
});

// // Fetch data on mounted
// onMounted(async () => {
//   const data = await fetchData();
//   resetForm({ values: data });
// });

// transaction type
const { value: propertyType } = useField('propertyType');
const { value: transactionType } = useField('transactionType');
const { value: selectedFacilities } = useField('selectedFacilities');

const { value: description, setValue: setDescription } = useField('description');
const { value: images } = useField('images', []);

// characteristics
const { value: roomCount } = useField('roomCount');
const { value: totalArea } = useField('totalArea');
const { value: surface } = useField('surface');
const { value: floor } = useField('floor');
const { value: balcony } = useField('balcony');
const { value: parking } = useField('parking');
const { value: apartmentCondition } = useField('apartmentCondition');
const { value: livingArea } = useField('livingArea');

// contat section
const { value: email } = useField('email');
const { value: phone } = useField('phone');

/**
 * Helpers
 */

const isAiDescriptionGenerating = ref(false)
const aiGeneratedDescription = ref(null)

const getFieldStatus = (fieldName) => {
  if (errors.value[fieldName]) {
    return 'errored';
  }
  const value = values[fieldName];
  if (value && value.length > 0) {
    return 'filled';
  }
  return 'empty';
};

// Utility function to get all fields and statuses
const getAllFieldStatuses = () => {
  return Object.keys(values).filter(fieldName => {
    return ! schema.describe().fields[fieldName]?.optional || false
  }).map((field) => {
    return {
      id: field,
      label: fieldLabels?.[field]?.['short'] || field,
      fullLabel: fieldLabels?.[field]?.['long'] || field,
      status: getFieldStatus(field),
      error: errors.value?.[field]
    };
  });
};

const fieldStatuses = computed(() => {
  return getAllFieldStatuses()
})

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
    if (aiGeneratedDescription.value?.length) {
      aiGeneratedDescription.value = newValue
    } else {
      setDescription(newValue)
    }
  }
}))

const handleAutoGenerate = async () => {
  try {
    isAiDescriptionGenerating.value = true

    const { data } = await generateDescription({
      text: description.value,
      tone: defaultTone.value
    })
    aiGeneratedDescription.value = data?.value.text
  } catch (err) {
    // show erro message
  } finally {
    isAiDescriptionGenerating.value = false
  }
}
</script>
