<template>
    <main class="flex flex-row space-x-2 ml-20">
      <div class="lg:w-1/2 md:w-full md:mx-auto flex">
        <div class="w-5/6">
          <div class="p-6 h-[20px]">
            <h1 class="text-xl font-semibold text-gray-900">Vindeți o proprietate?</h1>
            <p class="mt-1 text-sm text-gray-600">Urmează paşii, e mai simplu ca niciodată.</p>
          </div>
  
          <form @submit.prevent="onSubmit" class="no-scrollbar scrollShadow overflow-auto h-[calc(100vh-130px)] mt-[30px]">
            <div class="space-y-12 px-6 pb-4">
              <div class="border-b border-gray-900/10 pb-6">
                <CreateElementsFormType class="mt-4" :title="fieldsMeta['propertyType'].long" name="propertyType" />
                <CreateElementsTransactionType class="mt-4" :title="fieldsMeta['transactionType'].long" name="transactionType" />
                <FormAlert class="mt-4" message="Titlul anunțului se generează automat pe baza informațiilor furnizate." />
                <CreateElementsDescription class="mt-4" :title="fieldsMeta['description'].long" name="description" @applyeFields="handleApplyFields" />
                <CreateElementsImageUpload class="mt-4" name="images" />
  
                <!-- Facilities -->
                <Collapsible title="Facilitiati" class="mt-4 collapsible">
                  <CreateElementsFacilities name="selectedFacilities" />
                </Collapsible>
  
                <!-- Rooms and Details -->
                <Collapsible :isOpened="true" title="Caracteristici" class="mt-4 collapsible">
                  <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                    <CreateFormsApartment v-if="values['propertyType']=='apartment'" :fieldsMeta="fieldsMeta" />
                    <CreateFormsHouse v-if="values['propertyType']=='home'" :fieldsMeta="fieldsMeta" />
                    <CreateFormsCommercial v-if="values['propertyType']=='comercial'" :fieldsMeta="fieldsMeta" />
                    <CreateFormsLand v-if="values['propertyType']=='land'" :fieldsMeta="fieldsMeta" />
                  </div>

                  <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                    <CreateElementsPrice :title="fieldsMeta?.['price'].long" name="price" />
                    <CreateElementsLocation :title="fieldsMeta['location'].long" :description="fieldsMeta['location'].description" name="location" />
                  </div>
                </Collapsible>
                
                <!-- Contact Details -->
                <Collapsible :isOpened="true" title="Persoana de contact" class="mt-4 collapsible">
                  <CreateElementsPhone :title="fieldsMeta?.['phones'].long" name="phones" />
                </Collapsible>

                <div class="mt-4">
                  <FormAlert message='Nu găsiți informațiile dorite? Scrieți-ne la <a class="text-blue underline" target="_blank" href="mailto:contact@imai.ro?subject=Solicitare%20specificații">contact@imai.ro</a>, iar echipa noastră va adăuga specificațiile necesare pe site.' />
                </div>
  
                <div class="mt-4 flex justify-center">
                  <CreateElementsTermsAndConditions :title="fieldsMeta['terms_and_conditions'].long" name="terms_and_conditions" />
                </div>
              </div>
            </div>
          </form>

          <div class="h-[40px] px-6 mb-[5px]">
            <FormButton :class="['bg-blue-800 hover:bg-blue-700 w-full h-full text-lg']" :disabled="isSubmitting" text="Publică" @onClick="onSubmit" />
          </div>
        </div>
  
        <div class="w-1/6 flex justify-center items-center">
          <CreateTimeline class="my-8 overflow-hidden" :fields="fieldStatuses" />
        </div>
      </div>
  
      <div class="lg:w-1/2">
        <CreateElementsLocationMap :title="fieldsMeta['location'].long" :description="fieldsMeta['location'].description" name="location" />
      </div>
    </main>
  </template>
  
  <script setup>
  // adding https://preline.co//docs/confetti.html - x
  // when scroll to visible element shake it - x
  // use tone as dropdown to the same button - x
  // change characteristics & facilites based on property type - x
  // adding opt phone number verification - x
  // adding price & location fields -- location variable create in this component - x
  // adding location field in form with text pointing to the map - x

  // auto-generate facilities & characterhistics
  // fix textarea
  // once ai text generated hide generate with ai button until user start typing again
  // save & edit item
  // adding back-end API CRUD operations
  // make different color for generated description

  // allow to select text and apply AI changes
  // adding moderation - https://chatgpt.com/share/6756fcb7-6464-8006-9453-d5f41b730e1e
  // adding scrolling buttons & shadow // https://css-scroll-shadows.vercel.app/?bgColor=ffffff&shadowColor=666666&pxSize=34
  // adding moderation text & photos (photos min width & height) https://chatgpt.com/c/6768165f-b1a8-8006-80d6-d41efbb92dec
  // https://shift.infinite.red/avoid-nightmares-nsfw-js-ab7b176978b1
  // hide sidebar if responsive mobile
  // adding cloudflare protection
  
  import { useForm } from 'vee-validate'
  import { delay, scrollToElement, setHead, shakeElement } from '../../utils'
  
  setHead(
    'Listează-ți Proprietatea Gratuit', 
    'Adaugă anunțul tău imobiliar în câteva minute! Prezintă-ți proprietatea unui public larg de cumpărători și chiriași. Platformă ușor de utilizat pentru vânzare, închiriere sau leasing.'
  )
  
  const router = useRouter()
  
  // Field labels for real estate ads with short, long, and descriptive text
  const fieldsMeta = {
    propertyType: {
      required: true,
      short: "Tip propr.",
      long: "Tipul de proprietate",
      description: "Categoria de proprietate, cum ar fi apartament, casă, teren, sau altceva.",
    },
    transactionType: {
      required: true,
      short: "Tip tranz.",
      long: "Tipul de tranzacție",
      description: "Tipul de tranzacție dorită, cum ar fi vânzare, închiriere sau schimb.",
    },
    description: {
      required: true,
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
      required: true,
      short: "Img.",
      long: "Imagini",
      description: "Fotografii sau imagini ale proprietății pentru o prezentare vizuală mai clară.",
    },
    roomCount: {
      required: true,
      short: "Nr. camere",
      long: "Număr de camere",
      description: "Numărul total de camere disponibile în proprietate.",
    },
    area: {
      required: true,
      short: "Sup. totală",
      long: "Suprafață totală",
      description: "Suprafața totală a proprietății, incluzând toate anexele, cum ar fi balcoane.",
    },
    floor: {
      required: true,
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
    location: {
      required: true,
      short: "Loc.",
      long: "Locație",
      description: "Adresa sau locația utilizată pentru a identifica poziția sau punctul de contact."
    },
    price: {
      required: true,
      short: "Preț",
      long: "Prețul proprietății",
      description: "Costul proprietății, exprimat în moneda specificată.",
    },
    phones: {
      required: true,
      short: "Tel.",
      long: "Telefon",
      description: "Numărul de telefon pentru contact direct.",
    },
    terms_and_conditions: {
      required: true,
      short: "T&C",
      long: "Am citit și sunt de acord cu",
      description: "Termeni și condiții pentru utilizarea serviciului.",
    },
  };
  
  const initialValues = {
      propertyType: 'apartment',
      transactionType: 'sell',
      description: 'Apartament modern situat în inima orașului, perfect pentru cei care doresc să îmbine confortul cu accesibilitatea. Cu un design contemporan și finisaje de calitate, această locuință este ideală pentru familii sau tineri profesioniști.',

      images: [],
      selectedFacilities: [],

      roomCount: '',
      area: '',
      floor: '',
      balcony: '',
      parking: '',
      apartmentCondition: '',
      location: '',
      
      price: '',

      phones: [],
      terms_and_conditions: false
  }
  
  const { handleSubmit, errors, isSubmitting, values, setValues } = useForm({ initialValues });
  
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
  
  const getAllRequiredFields = () => {
    const orderedFields = Object.keys(initialValues)

    return Object.keys(values).filter(fieldName => {
      return fieldsMeta[fieldName]?.required || false
    }).sort((a, b) => orderedFields.indexOf(a) - orderedFields.indexOf(b));
  }
  
  const fieldsToBeExcludedFromTimeline = () => {
    return ['propertyType', 'transactionType', 'terms_and_conditions']
  }
  
  // Utility function to get all fields and statuses
  const getAllFieldStatuses = () => {
    return getAllRequiredFields()
    .filter(el => ! fieldsToBeExcludedFromTimeline().includes(el))
    .map((field) => {
      return {
        id: field,
        label: fieldsMeta?.[field]?.['short'] || field,
        description: fieldsMeta?.[field]?.['description'] || field,
        status: getFieldStatus(field),
        error: errors.value?.[field]
      };
    });
  };
  
  const fieldStatuses = computed(() => {
    return getAllFieldStatuses()
  })

  const handleApplyFields = fields => {
    setValues(fields)
  }

  const onSubmit = handleSubmit(async(values) => {
    console.log('Submitted:', values);

    await delay(300)
    router.push('create/success')
  }, async({ errors }) => {
    const orderedFields = Object.keys(initialValues)
    const requiredFields = getAllRequiredFields()

    const errorsOnSubmit = Object.keys(errors).filter(el => requiredFields.includes(el)).sort((a, b) => orderedFields.indexOf(a) - orderedFields.indexOf(b));
  
    if(errorsOnSubmit.length) {
      await scrollToElement(errorsOnSubmit[0])
      shakeElement(errorsOnSubmit[0])
    }
  });
  
  // // Fetch data on mounted
  // onMounted(async () => {
  //   const data = await fetchData();
  //   resetForm({ values: data });
  // });
  </script>
  
  <style>
  .scrollShadow {
   --shadow-color:  #00000055;
   --shadow-size: 30px;
   z-index: 9999999;
  
   background-image: linear-gradient(
     var(--shadow-color) 0%,
     transparent calc((var(--scroll)) * var(--shadow-size)),
  
     /* The below "transparent" color-stop starts at the bottom with an offset 
      * of the size of the shadow which is multiplied by a bumber from 0 to 1, 
      * which decreases the more is scrolled down, meanning the bottom's 
      * shadow size decreases the more is scrolled down. 
      */
     transparent calc(100% - var(--shadow-size) * (1 - var(--scroll))),
     var(--shadow-color) 100%
   );
  
   background-position-y: var(--shadow-offset);
   background-size: 100% calc(100% - var(--shadow-offset));
   
   animation: scroll-shadows cubic-bezier(.25,.85,.8,.22);;
   animation-timeline: scroll(self);
   animation-range: 0 100%;
  }
  
  @property --scroll {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;  
  }
  
  @keyframes scroll-shadows {
    /* Sets the shadow-color only if the element is scrollable */
    from, to { --shadow-color: #0003; }
    to {
      --scroll: 1;
    }
  }
  </style>
  