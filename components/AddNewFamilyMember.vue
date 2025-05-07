<template>
    <v-row justify="center">
        <v-col cols="12" md="3">

            <v-toolbar density="compact" title="Add new member" class="mb-2"></v-toolbar>
            <v-form ref="form" @submit.prevent="validate()" lazy-validation>
                <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

                <v-select v-model="gender" :items="genders" :rules="[v => !!v || 'Gender selection is required']"
                    label="Gender" required></v-select>

                <v-date-input :rules="dateRules" prepend-icon="" v-model="birthDate" label="Birth date"></v-date-input>
                <v-autocomplete v-model="fatherId" :rules="fatherRules" label="Father Name" item-title="name"
                    item-value="id" :items="usersData" :loading="fathersDataLoading" prepend-inner-icon="mdi-magnify" @update:search="onFatherSearch">
                </v-autocomplete>
                <v-autocomplete v-model="motherId" :rules="motherRules" label="Mother Name" item-title="name"
                    item-value="id" :items="usersData" prepend-inner-icon="mdi-magnify" @update:search="onSearch">
                </v-autocomplete>

                <div class="d-flex justify-end ga-2 mt-6">
                    <v-btn class="" color="error" @click="reset">
                        Reset data
                    </v-btn>
                    <v-btn class="" color="success" type="submit" :loading="loading">
                        Save member
                    </v-btn>
                </div>
            </v-form>
        </v-col>
    </v-row>
</template>
<script setup>
import { ref } from 'vue'
import { UserService } from '~/services/UserService'

const form = ref(null)

const genders = [
    'Male',
    'Female',
]

const name = ref('Test name')
const usersData = ref([])
const motherId = ref()
const fatherId = ref()
const birthDate = ref(new Date().toISOString().substring(0, 10))
const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length >= 3) || 'Name must be 3 characters atleast',
])
const dateRules = ref([
    v => !!v || 'Birthdate is required',
])
const motherRules = ref([
    v => !!v || 'Mother name is required',
])
const fatherRules = ref([
    v => !!v || 'Father name is required',
])
const gender = ref('Male')
const loading = ref(false)

const userData = computed(() => {
    return {
        name: name.value,
        mother_id: motherId.value,
        father_id: fatherId.value,
        gender: gender.value.toLocaleLowerCase(),
        birth_date: birthDate.value,
    }
})

onMounted(() => {
    // reset()
    // getAllUsers()
})
const userLoading = ref(false)
const fathersDataLoading = ref(false)
const getAllUsers = async (search = '') => {
    userLoading.value = true
    const query = search.length ? `?query=${search}` : ''
    UserService.getAll(query)
        .then((response) => {
            console.log(response.data, 'response');
            usersData.value = response.data
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            userLoading.value = false
            fathersDataLoading.value = false
        })
}
const onSearch = (search) => {
    if (search.length) {
        userLoading.value = true
        getAllUsers(search)
    }else {
        usersData.value = []
    }   
}
const onFatherSearch = (search) => {
    if (search.length) {
        fathersDataLoading.value = true
        getAllUsers(search)
    }else {
        usersData.value = []
    }   
}
const validate = async () => {
    console.log(form.value);
    const { valid } = await form.value.validate()

    if (valid) saveNewFamilyMember()
}
const saveNewFamilyMember = async () => {
    loading.value = true
    UserService.create(userData.value)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            loading.value = false
        })
}
function reset() {
    form.value.reset()
}
function resetValidation() {
    form.value.resetValidation()
}
</script>