<template>
    <main class="flex flex-row space-x-2 ml-20">
        <div class="w-1/2">
            <div class="p-6 h-[20px]">
                <h1 class="text-xl font-semibold text-gray-900">Adaugă acum anunțul tău</h1>
                <p class="mt-1 text-sm text-gray-600">Urmează paşii, e mai simplu ca niciodată.</p>
            </div>

            <form @submit.prevent="onSubmit" class="no-scrollbar overflow-auto h-[calc(100vh-130px)] mt-[30px]">
                <div class="space-y-12 px-6 pb-6">
                    <div class="border-b border-gray-900/10 pb-12">
    
                        <!-- Property Type -->
                        <div class="mt-10">
                            <FormRadioGroup :items="[{id: 'apartment', title: 'Apartament'}, {id: 'casa', title: 'Casă'}, {id: 'comercial', title: 'Comercial'}]" />
                        </div>

                        <!-- Transaction Type -->
                        <div class="mt-10">
                            <label class="block text-sm font-medium text-gray-900">Tip tranzacție</label>
                            <div class="mt-2 flex gap-4">
                                <button type="button"
                                    class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">De
                                    vânzare</button>
                                <button type="button"
                                    class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">De
                                    închiriat</button>
                            </div>
                        </div>

                        <!-- Title -->
                        <div class="mt-10">
                            <label for="title" class="block text-sm font-medium text-gray-900">Titlu anunț</label>
                            <div class="mt-2">
                                <input v-model="title" type="text" id="title"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                                    placeholder="Apartament de vânzare 2 camere acum" />
                                <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
                            </div>
                            <p class="mt-2 text-sm text-gray-500">46 caractere rămase.</p>
                        </div>

                        <!-- Description -->
                        <div class="col-span-full">
                            <label for="description"
                                class="block text-sm/6 font-medium text-gray-900">Description</label>
                            <div class="mt-2">
                                <textarea v-model="description" id="description" rows="3"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                                <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
                            </div>
                            <p class="mt-3 text-sm/6 text-gray-600">Write a few sentences about.</p>
                        </div>

                        <!-- Image Upload -->
                        <FileUpload
                            id="upload"
                            :accept="'image/png, image/jpeg'"
                            :multiple="true"
                            :maxFileSize="5 * 1024 * 1024"
                            acceptText="PNG or JPG, smaller than 5MB"
                            @files-selected="handleFiles"
                        />

                        <!-- Rooms and Details -->
                        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                            <div>
                                <label for="floor" class="block text-sm font-medium text-gray-900">Etaj</label>
                                <input v-model="floor" id="floor" type="text"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                                    placeholder="Etaj 7" />
                                <p v-if="errors.floor" class="text-red-500 text-sm">{{ errors.floor }}</p>
                            </div>

                            <div>
                                <label for="surface" class="block text-sm font-medium text-gray-900">Suprafață
                                    utilă</label>
                                <input v-model="surface" id="surface" type="text"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                                    placeholder="mp" />
                                <p v-if="errors.surface" class="text-red-500 text-sm">{{ errors.surface }}</p>
                            </div>
                        </div>

                        <!-- Contact Details -->
                        <div class="mt-10">
                            <label for="contact" class="block text-sm font-medium text-gray-900">Persoana de
                                contact</label>
                            <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <input v-model="email" id="email" type="email" placeholder="Email"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>

                                <input v-model="phone" id="phone" type="text" placeholder="Telefon"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <div class="h-[40px] my-[5px] flex justify-end gap-4">
                <button type="button" class="text-sm font-medium text-gray-900">Anulează</button>
                <button type="submit"
                    class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline focus:ring-2 focus:ring-indigo-600">
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
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

// Reactive array for image previews
const previewImages = ref([]);

const handleFiles = (files) => {
  console.log('Selected files:', files)
}

// Define the validation schema
const schema = yup.object({
    title: yup.string().required('Titlul este obligatoriu').max(46, 'Maxim 46 caractere.'),
    description: yup.string().required('description este obligatoriu').max(500, 'Maxim 500 caractere.'),
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
    console.log('Form submitted with:', values, previewImages.value);
});

// Register fields with validation
const { value: title } = useField('title');
const { value: description } = useField('description');
const { value: floor } = useField('floor');
const { value: surface } = useField('surface');
const { value: email } = useField('email');
const { value: phone } = useField('phone');
</script>
