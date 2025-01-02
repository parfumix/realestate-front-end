<template>
    <div>
        <FormFileUpload :required="true" id="images" :accept="'image/png, image/jpeg'" :multiple="true"
            :maxFileSize="5 * 1024 * 1024" :maxFiles="MAX_FILES" v-model="value" @change="handleChange" :error="errorMessage" />
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import * as yup from 'yup'

const MIN_FILES = 1
const MAX_FILES = 10

const props = defineProps({
    name: String,
    title: String,
});

const { value, setValue, errorMessage } = useField(() => props.name, yup
    .array()
    .test(
        "fileSize",
        "Dimensiunea fișierului trebuie să fie mai mică de 5 MB.",
        (files) => files && files.every((file) => file.size <= 5 * 1024 * 1024)
    )
    .test(
        "fileType",
        "Sunt permise doar fișierele PNG și JPEG.",
        (files) =>
          files &&
          files.every((file) =>
            ["image/jpeg", "image/png", "image/gif"].includes(file.type)
          )
    )
    .min(MIN_FILES, 'Este necesară cel puțin o imagine.')
    .max(MAX_FILES, 'Este admis cel mult 10 imagini.')
    .test('maxFiles', 'Sunt permise cel mult 10 imagini.', (files) => {
        return files.length <= MAX_FILES;
    })
    .required('Este necesară cel puțin o imagine.'));

const handleChange = (files) => {
    setValue(files);
}
</script>