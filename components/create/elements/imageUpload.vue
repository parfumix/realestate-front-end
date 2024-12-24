<template>
    <div>
        <FormFileUpload :required="true" id="images" :accept="'image/png, image/jpeg'" :multiple="true"
            :maxFileSize="5 * 1024 * 1024" v-model="value" :error="errorMessage" />
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const props = defineProps({
    name: String,
    title: String,
});

const { value, errorMessage } = useField(() => props.name, yup
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
    .min(1, 'Este necesară cel puțin o imagine.')
    .required('Este necesară cel puțin o imagine.'));
</script>