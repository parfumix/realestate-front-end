<template>
  <main class="flex flex-row space-x-2 ml-20">
    <div class="w-1/2">
      <form @submit.prevent="onSubmit" class="no-scrollbar overflow-auto h-[calc(100vh-50px)]">
        <div class="space-y-12 p-6">
          <div class="border-b border-gray-900/10 pb-12">
            <h2 class="text-base font-semibold text-gray-900">Modifică oferta</h2>
            <p class="mt-1 text-sm text-gray-600">Urmează paşii, e mai simplu ca niciodată.</p>

            <!-- Property Type -->
            <div class="mt-10">
              <label class="block text-sm font-medium text-gray-900">Tip proprietate</label>
              <div class="mt-2 flex gap-4">
                <button type="button" class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">Apartament</button>
                <button type="button" class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">Casă</button>
                <button type="button" class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">Teren</button>
                <button type="button" class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">Comercial</button>
              </div>
            </div>

            <!-- Transaction Type -->
            <div class="mt-10">
              <label class="block text-sm font-medium text-gray-900">Tip tranzacție</label>
              <div class="mt-2 flex gap-4">
                <button type="button" class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">De vânzare</button>
                <button type="button" class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">De închiriat</button>
              </div>
            </div>

            <!-- Title -->
            <div class="mt-10">
              <label for="title" class="block text-sm font-medium text-gray-900">Titlu anunț</label>
              <div class="mt-2">
                <input
                  v-model="title"
                  type="text"
                  id="title"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                  placeholder="Apartament de vânzare 2 camere acum"
                />
                <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
              </div>
              <p class="mt-2 text-sm text-gray-500">46 caractere rămase.</p>
            </div>

            <!-- Image Upload -->
            <div class="mt-10">
              <label for="images" class="block text-sm font-medium text-gray-900">Imagini</label>
              <div
                class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div class="text-center">
                  <p class="text-sm text-gray-600">Trage imaginea aici sau încarcă una de pe dispozitivul tău.</p>
                  <input id="images" name="images" type="file" class="sr-only" />
                  <p class="text-xs text-gray-500">PNG, JPG, GIF până la 10MB</p>
                </div>
              </div>
            </div>

            <!-- Rooms and Details -->
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div>
                <label for="floor" class="block text-sm font-medium text-gray-900">Etaj</label>
                <input
                  v-model="floor"
                  id="floor"
                  type="text"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                  placeholder="Etaj 7"
                />
                <p v-if="errors.floor" class="text-red-500 text-sm">{{ errors.floor }}</p>
              </div>

              <div>
                <label for="surface" class="block text-sm font-medium text-gray-900">Suprafață utilă</label>
                <input
                  v-model="surface"
                  id="surface"
                  type="text"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                  placeholder="mp"
                />
                <p v-if="errors.surface" class="text-red-500 text-sm">{{ errors.surface }}</p>
              </div>
            </div>

            <!-- Contact Details -->
            <div class="mt-10">
              <label for="contact" class="block text-sm font-medium text-gray-900">Persoana de contact</label>
              <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <input
                  v-model="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                />
                <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>

                <input
                  v-model="phone"
                  id="phone"
                  type="text"
                  placeholder="Telefon"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                />
                <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div class="h-[40px] my-[5px] flex justify-end gap-4">
            <button type="button" class="text-sm font-medium text-gray-900">Anulează</button>
            <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline focus:ring-2 focus:ring-indigo-600">
              Salvează
            </button>
          </div>
    </div>

    <div class="w-1/2">
      <AdMap class="w-full h-full" />
    </div>
  </main>
</template>

<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

// Define the validation schema
const schema = yup.object({
  title: yup.string().required('Titlul este obligatoriu').max(46, 'Maxim 46 caractere.'),
  floor: yup.number().typeError('Etajul trebuie să fie un număr').required('Etajul este obligatoriu'),
  surface: yup
    .number()
    .typeError('Suprafața trebuie să fie un număr')
    .required('Suprafața este obligatorie'),
  email: yup.string().email('Email invalid').required('Emailul este obligatoriu'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Numărul de telefon trebuie să fie format din 10 cifre')
    .required('Telefonul este obligatoriu'),
});

// Initialize the form
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

// Define the submit handler
const onSubmit = handleSubmit((values) => {
  console.log('Form submitted with:', values);
});

// Register fields with validation
const { value: title } = useField('title');
const { value: floor } = useField('floor');
const { value: surface } = useField('surface');
const { value: email } = useField('email');
const { value: phone } = useField('phone');
</script>
