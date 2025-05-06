<template>
    <v-row justify="center">
        <v-col cols="12" md="3">


            <v-form ref="form">
                <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

                <v-select v-model="gender" :items="genders" :rules="[v => !!v || 'Gender selection is required']"
                    label="Gender" required></v-select>

                <v-date-input prepend-icon="" label="Birth date"></v-date-input>
                <v-autocomplete v-model="fatherId" :rules="fatherRules" label="Father Name"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-autocomplete>
                <v-autocomplete v-model="motherId" :rules="motherRules" label="Mother Name"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-autocomplete>

                <div class="d-flex flex-column">
                    <v-btn class="mt-4" color="success" block @click="validate">
                        Save member
                    </v-btn>

                    <v-btn class="mt-4" color="error" block @click="reset">
                        Reset data
                    </v-btn>
                </div>
            </v-form>
        </v-col>
    </v-row>
</template>
<script setup>
import { ref } from 'vue'

const form = ref()

const genders = [
    'Male',
    'Female',
]

const name = ref('')
const motherId = ref('')
const fatherId = ref('')
const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length >= 3) || 'Name must be 3 characters atleast',
])
const dateRules = ref([
    v => !!v || 'Birthdate is required',
])
const motherRules = ref([
    v => !!v || 'Mother name is required',
    v => (v && v.length >= 3) || 'Mother name must be 3 characters atleast',
])
const fatherRules = ref([
    v => !!v || 'Father name is required',
    v => (v && v.length >= 3) || 'Father name must be 3 characters atleast',
])
const gender = ref(null)
const checkbox = ref(false)

async function validate() {
    const { valid } = await form.value.validate()

    if (valid) alert('Form is valid')
}
function reset() {
    form.value.reset()
}
function resetValidation() {
    form.value.resetValidation()
}
</script>