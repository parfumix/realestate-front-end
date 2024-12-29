<template>
    <div>
        <FormFileUpload :required="true" id="images" :accept="'image/png, image/jpeg'" :multiple="true"
            :maxFileSize="5 * 1024 * 1024" :maxFiles="MAX_FILES" v-model="value" :error="errorMessage" />
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const MIN_FILES = 1
const MAX_FILES = 3

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
    .min(MIN_FILES, 'Este necesară cel puțin o imagine.')
    .max(MAX_FILES, 'Este admis cel mult 10 imagini.')
    .test('maxFiles', 'Sunt permise cel mult 10 imagini.', (files) => {
        return files.length <= MAX_FILES;
    })
    .required('Este necesară cel puțin o imagine.'));
</script>