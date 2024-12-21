<template>
  <main class="flex flex-row space-x-2 ml-20">
    <div class="w-1/2 flex">

      <div class="w-5/6">
        <div class="p-6 h-[20px]">
          <h1 class="text-xl font-semibold text-gray-900">Vindeți o proprietate?</h1>
          <p class="mt-1 text-sm text-gray-600">Urmează paşii, e mai simplu ca niciodată.</p>
        </div>

        <form @submit.prevent="onSubmit" class="no-scrollbar overflow-auto h-[calc(100vh-130px)] mt-[30px]">
          <div class="space-y-12 px-6 pb-4">
            <div class="border-b border-gray-900/10 pb-6">
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

              <div class="mt-4">
                <FormAlert message="Titlul anunțului se generează automat pe baza informațiilor furnizate." />
              </div>

              <!-- Description -->
              <div class="mt-4">
                <FormTextareaActions
                  id="description" 
                  :required="isFieldRequired('images')" 
                  :maxLength="500"
                  :rows="6"
                  v-model="computedDescription" 
                  :label="fieldLabels['description'].long"
                  placeholder="Acest apartament modern cu 3 camere oferă finisaje de calitate superioară, spații luminoase și este situat într-o zonă centrală, aproape de toate facilitățile..."
                  :error="errors.description"
                >
                  <template #left-actions>
                    <div class="flex flex-row my-2 justify-between">
                        <FormDropdown @click="handleSelectTone" :defaultItem="defaultTone" :buttonLabel="defaultTone ? (toneItems.find(el => el.value == defaultTone)?.label ?? 'Alege tonul') : 'Alege tonul'" :menuItems="toneItems" />
                      </div>
                  </template>
                  <template #right-actions>
                    <div class="flex items-center">
                      <div class="mr-4 flex items-center space-x-2">
                        <p @click="handleDiscard" v-if="aiGeneratedDescription?.length && !isAiDescriptionGenerating" class="flex items-center cursor-pointer">
                          <Trash size="14" class="mr-1" />
                          Renunță
                        </p>
                        <p @click="handleApply" v-if="aiGeneratedDescription?.length && !isAiDescriptionGenerating" class="flex items-center cursor-pointer">
                          <Check size="14" class="mr-1" />
                          Aplică
                        </p>
                      </div>

                      <FormButton :disabled="(isAiDescriptionGenerating || description?.length < 7) ? true : false" @onClick="handleAutoGenerate" :class="[{'bg-gray-300 hover:bg-gray-350': description?.length < 7 || isAiDescriptionGenerating, 'bg-blue-700 hover:bg-blue-700': description?.length >= 7 && !isAiDescriptionGenerating}, 'flex items-center text-white']">
                        <RefreshCcw size="14" :class="[{ 'animate-spin': isAiDescriptionGenerating }, 'mr-1 lucide lucide-rotate-ccw']" />
                        {{ isAiDescriptionGenerating ? 'Se generează' : (aiGeneratedDescription?.length ? 'Încercați din nou' : 'Generează cu AI') }}
                      </FormButton>
                    </div>
                  </template>
                </FormTextareaActions>
              </div>

              <!-- Image Upload -->
              <div class="mt-4">
                <FormFileUpload :required="isFieldRequired('images')" id="images" :accept="'image/png, image/jpeg'" :multiple="true"
                  :maxFileSize="5 * 1024 * 1024" acceptText="Sunt permise doar fișierele PNG și JPEG" v-model="images"
                  :error="errors.images" />
              </div>

              <!-- Facilities -->
              <Collapsible title="Facilitiati" class="mt-4 collapsible">
                  <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-col" v-for="items in distributeArray(facilities, 3)">
                        <FormCheckbox :collapsible="true" :options="items" v-model="selectedFacilities" />
                    </div>
                  </div>
              </Collapsible>

              <!-- Rooms and Details -->
              <Collapsible :isOpened="false" title="Caracteristici" class="mt-4 collapsible">
                <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                  <FormSelect id="roomCount" :required="isFieldRequired('roomCount')" name="roomCount" :options="roomCountOptions" :label="fieldLabels['roomCount'].long"
                    placeholder="Select" v-model="roomCount" :error="errors.roomCount" />

                  <FormInput id="totalArea" :required="isFieldRequired('totalArea')" name="totalArea" :label="fieldLabels['totalArea'].long" placeholder="mp" v-model="totalArea"
                    :error="errors.totalArea" />

                  <FormInput id="surface" :required="isFieldRequired('surface')" name="surface" :label="fieldLabels['surface'].long" placeholder="mp" v-model="surface"
                    :error="errors.surface" />

                  <FormSelect id="floor" :required="isFieldRequired('floor')" name="floor" :options="floorOptions" :label="fieldLabels['floor'].long" placeholder="Select"
                    v-model="floor" :error="errors.floor" />

                  <FormSelect id="balcony" :required="isFieldRequired('balcony')" name="balcony" :options="balconyOptions" :label="fieldLabels['balcony'].long"
                    placeholder="Select" v-model="balcony" :error="errors.balcony" />

                  <FormSelect id="parking" :required="isFieldRequired('parking')"  name="parking" :options="parkingOptions" :label="fieldLabels['parking'].long"
                    placeholder="Select" v-model="parking" :error="errors.parking" />

                  <FormSelect id="apartmentCondition" name="apartmentCondition" :options="apartmentConditionOptions"
                    :label="fieldLabels['apartmentCondition'].long" placeholder="Select" v-model="apartmentCondition" :error="errors.apartmentCondition" />
                </div>
              </Collapsible>
              
              <!-- Contact Details -->
              <Collapsible :isOpened="true" title="Persoana de contact" class="mt-4 collapsible">
                <FormInput id="email" :required="isFieldRequired('email')" name="email" :label="fieldLabels['email'].long" placeholder="Email" type="email" v-model="email"
                  :error="errors.email" />
                <FormInput id="phone" :required="isFieldRequired('phone')" name="phone" :label="fieldLabels['phone'].long" placeholder="Telefon" v-model="phone"
                  :error="errors.phone" />
              </Collapsible>

              <div class="mt-4">
                <FormAlert message='Nu găsiți informațiile dorite? Scrieți-ne la <a class="text-blue underline" href="mailto:contact@imai.ro?subject=Solicitare%20specificații">contact@imai.ro</a>, iar echipa noastră va adăuga specificațiile necesare pe site.' />
              </div>

              <div class="mt-4 flex justify-center">
                <FormCheckbox :collapsible="true" :options="[{value: 1, label: 'Am citit și sunt de acord cu termenii și condițiile imai.ro'}]" v-model="selectedFacilities" />
              </div>
            </div>
          </div>
        </form>

        <div class="h-[40px] px-6 my-[5px] flex justify-end gap-4">
          <FormButton defaultClass="w-full bg-blue-800 hover:bg-blue-700 text-lg font-semibold text-white" :disabled="isSubmitting" text="Publică" @onClick="onSubmit" />
        </div>
      </div>

      <div class="w-1/6 flex justify-center items-center">
        <CreateTimeline class="my-8 overflow-hidden" :fields="fieldStatuses" />
      </div>
    </div>

    <div class="w-1/2">
      <CreateMap class="w-full h-full" />
    </div>
  </main>
</template>

<script setup>
//TODO adding moderation - https://chatgpt.com/share/6756fcb7-6464-8006-9453-d5f41b730e1e
//TODO https://preline.co//docs/confetti.html

// save & edit item
// fix textarea
// review all fields
// allow to select text and apply AI changes
// adding back-end API CRUD operations
// when scroll to visible element shake it
// adding opt phone number verification https://chatgpt.com/share/6767432b-3a48-8006-a091-4544d72527cd
// adding price & location fields
// adding label for fileUpload image
// adding scrolling buttons
// 

import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

import { distributeArray } from '../utils';
import { generateDescription } from '../api/create'

import { Trash, Check, RefreshCcw } from 'lucide-vue-next'

const { user } = useAuthService()

const propertyTypeOptions = [
  {
    title: "Apartament",
    value: "apartment",
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building w-5 h-5"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
    `,
  },
  {
    title: "Casă",
    value: "home",
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house w-5 h-5"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    `,
  },
  {
    title: "Comercial",
    value: "comercial",
    svg: `
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lamp-desk w-5 h-5"><path d="m14 5-3 3 2 7 8-8-7-2Z"/><path d="m14 5-3 3-3-3 3-3 3 3Z"/><path d="M9.5 6.5 4 12l3 6"/><path d="M3 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H3Z"/></svg>
    `,
  },
  {
    title: "Loturi de teren",
    value: "land",
    svg: `
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-land-plot"><path d="m12 8 6-3-6-3v10"/><path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"/><path d="m6.49 12.85 11.02 6.3"/><path d="M17.51 12.85 6.5 19.15"/></svg>
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

// Field labels for real estate ads with short, long, and descriptive text
const fieldLabels = {
  propertyType: {
    short: "Tip propr.",
    long: "Tipul de proprietate",
    description: "Categoria de proprietate, cum ar fi apartament, casă, teren, sau altceva.",
  },
  transactionType: {
    short: "Tip tranz.",
    long: "Tipul de tranzacție",
    description: "Tipul de tranzacție dorită, cum ar fi vânzare, închiriere sau schimb.",
  },
  description: {
    short: "Descr.",
    long: "Descriere",
    description: "Un text detaliat care evidențiază caracteristicile și avantajele proprietății.",
  },
  selectedFacilities: {
    short: "Facilități",
    long: "Facilități",
    description: "Lista facilităților disponibile, cum ar fi lift, piscină, parcare subterană.",
  },
  images: {
    short: "Img.",
    long: "Imagini",
    description: "Fotografii sau imagini ale proprietății pentru o prezentare vizuală mai clară.",
  },
  roomCount: {
    short: "Nr. camere",
    long: "Număr de camere",
    description: "Numărul total de camere disponibile în proprietate.",
  },
  totalArea: {
    short: "Sup. totală",
    long: "Suprafață totală",
    description: "Suprafața totală a proprietății, incluzând toate anexele, cum ar fi balcoane.",
  },
  surface: {
    short: "Sup. utilă",
    long: "Suprafață utilă",
    description: "Suprafața utilizabilă efectivă a spațiului, excluzând anexele.",
  },
  floor: {
    short: "Etaj",
    long: "Etaj",
    description: "Nivelul etajului unde se află proprietatea (ex: parter, etaj 1, mansardă).",
  },
  balcony: {
    short: "Balcon",
    long: "Balcon/lojie",
    description: "Detalii despre balcoane sau lojiile incluse, cum ar fi dimensiunea sau numărul acestora.",
  },
  parking: {
    short: "Parcare",
    long: "Loc de parcare",
    description: "Informații despre disponibilitatea și tipul locului de parcare.",
  },
  apartmentCondition: {
    short: "Stare ap.",
    long: "Starea apartamentului",
    description: "Starea actuală a apartamentului, cum ar fi renovat, mobilat, semifinisat.",
  },
  email: {
    short: "Email",
    long: "Email",
    description: "Adresa de email utilizată pentru a fi contactat.",
  },
  phone: {
    short: "Tel.",
    long: "Telefon",
    description: "Numărul de telefon pentru contact direct.",
  },
};

const defaultTone = ref('professional')

const schema = yup.object({
  // transaction type
  propertyType: yup.mixed().oneOf(['apartment', 'home', 'comercial', 'land']),
  transactionType: yup.mixed().oneOf(['sell', 'rent']),
  selectedFacilities: yup.string().optional(),

  description: yup.string().required('Descrierea este obligatorie').min(100, 'Minim 100 de caractere').max(500, 'Maximum 500 de caractere'),
  images: yup
    .array()
    .of(
      yup
        .mixed()
        .test('fileType', 'Sunt permise doar fișierele PNG și JPEG.', (value) => {
          return value.file && ['image/png', 'image/jpeg'].includes(value.file.type);
        })
        .test('fileSize', 'Dimensiunea fișierului trebuie să fie mai mică de 5 MB.', (value) => {
          return value.file && value.file.size <= 5 * 1024 * 1024; // 5MB
        })
    )
    .required('Este necesară cel puțin o imagine.'),

  // characteristics
  roomCount: yup
    .number()
    .typeError('Numărul de camere trebuie să fie un număr')
    .required('Numărul de camere este obligatoriu'),
  
  totalArea: yup.number().typeError('Trebuie să fie un număr').required('Suprafața totală este obligatorie'),
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

const isFieldRequired = fieldName => {
  return ! schema.describe().fields[fieldName]?.optional || false
}

// Utility function to get all fields and statuses
const getAllFieldStatuses = () => {
  return Object.keys(values).filter(fieldName => {
    return isFieldRequired(fieldName)
  }).map((field) => {
    return {
      id: field,
      label: fieldLabels?.[field]?.['short'] || field,
      description: fieldLabels?.[field]?.['description'] || field,
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
    if(! description.value?.length || description.value?.length < 7) return

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
