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
                            <FormRadioGroup legend="Tipul de proprietate" description="" name="property-type" :items="[
                                { id: 'apartment', title: 'Apartament' },
                                { id: 'casa', title: 'Casă' },
                                { id: 'comercial', title: 'Comercial' }
                            ]" v-model:value="propertyType" />
                        </div>

                        <!-- Transaction Type -->
                        <div class="mt-10">
                            <FormButton text="De vânzare" @click="setTransactionType('vanzare')" />
                            <FormButton text="De închiriat" @click="setTransactionType('inchiriere')" />
                        </div>

                        <!-- Title -->
                        <div class="mt-10">
                            <FormInput id="title" name="title" label="Titlu anunț"
                                placeholder="Apartament de vânzare 2 camere acum" v-model:value="title"
                                :error="errors.title" />
                        </div>

                        <!-- Description -->
                        <div class="mt-10">
                            <FormTextArea id="description" name="description" label="Descriere"
                                placeholder="Scrie câteva propoziții despre proprietate." rows="3"
                                v-model:value="description" :error="errors.description" />
                        </div>

                        <!-- Image Upload -->
                        <FormFileUpload id="upload" :accept="'image/png, image/jpeg'" :multiple="true"
                            :maxFileSize="5 * 1024 * 1024" acceptText="PNG or JPG, smaller than 5MB"
                            @files-selected="handleFiles" />

                        <!-- Rooms and Details -->
                        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                            <FormInput id="floor" name="floor" label="Etaj" placeholder="Etaj 7" v-model:value="floor"
                                :error="errors.floor" />
                            <FormInput id="surface" name="surface" label="Suprafață utilă" placeholder="mp"
                                v-model:value="surface" :error="errors.surface" />
                        </div>

                        <!-- Contact Details -->
                        <div class="mt-10">
                            <FormInput id="email" name="email" label="Email" placeholder="Email" type="email"
                                v-model:value="email" :error="errors.email" />
                            <FormInput id="phone" name="phone" label="Telefon" placeholder="Telefon"
                                v-model:value="phone" :error="errors.phone" />
                        </div>
                    </div>
                </div>
            </form>

            <div class="h-[40px] my-[5px] flex justify-end gap-4">
                <FormButton text="Anulează" />
                <FormButton text="Salvează" @click="onSubmit" />
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

const propertyType = ref('');
const transactionType = ref('');
const setTransactionType = (type) => (transactionType.value = type);

const handleFiles = (files) => {
  console.log('Selected files:', files);
};

const schema = yup.object({
  title: yup.string().required('Titlul este obligatoriu').max(46),
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

const { value: title } = useField('title');
const { value: description } = useField('description');
const { value: floor } = useField('floor');
const { value: surface } = useField('surface');
const { value: email } = useField('email');
const { value: phone } = useField('phone');
</script>
