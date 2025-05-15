<template>

    <v-row justify="center" class="mt-16">
        <v-col cols="12" md="3">
            <figure class="d-flex justify-center mb-4">
                <v-list>
                    <v-list-item :subtitle="'History & connections'" :title="'KS Family'">
                        <template v-slot:prepend>
                            <v-avatar :color="'blue'" src>
                                <v-img alt="John" src="/logo.jpg"></v-img>
                            </v-avatar>
                        </template>
                    </v-list-item>
                </v-list>
            </figure>
            <v-card :class="mdAndUp ? 'flat elevation-2' : 'elevation-0 border-0'" class="pa-4 pa-md-8">

                <header density="flat" class="mb-6">
                    <h3 class="text-h6 font-weight-medium text-center">Register your information</h3>
                </header>

                <v-form ref="form" @submit.prevent="validate()" lazy-validation>
                    <v-text-field v-model="name" :rules="nameRules" label="Name" required
                        prepend-inner-icon="mdi-account" variant="solo">
                        <template #label>
                            Name <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    <v-text-field v-model="email" :rules="emailRules" label="Email" required
                        prepend-inner-icon="mdi-mail" variant="solo">
                        <template #label>
                            Email <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    
                    <v-text-field type="password" v-model="password" :rules="passwordRules" label="Password" required
                        prepend-inner-icon="mdi-shield-key" variant="solo" class="mt-2">
                        <template #label>
                            Password <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    <v-text-field type="password" v-model="cPassword" :rules="cPasswordRules" label="Password" required
                        prepend-inner-icon="mdi-lock" variant="solo" class="mt-2">
                        <template #label>
                            Confirm Password <span class="text-red">*</span>
                        </template>
                    </v-text-field>


                    <div class="d-flex ga-2 mt-6">
                        <v-btn class="order-1 order-md-2" size="large" style="width: 100%;" color="primary"
                            type="submit" :loading="loading">

                            Register
                            <v-icon class="ml-2" start>mdi-arrow-right</v-icon>
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
            <p class="text-center text-sm mt-4">Alread have an account?<br>
                <nuxt-link to="/login" class="font-bold text-base text-primary-600 hover:text-primary-500">
                    Login here
                </nuxt-link>
            </p>
        </v-col>
    </v-row>

</template>
<script setup>
import { ref } from 'vue'
import { UserService } from '~/services/UserService'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
const form = ref(null)

const genders = [
    'Male',
    'Female',
]

const email = ref('')
const cPassword = ref()
const name = ref('')
const password = ref()
const motherId = ref()
const fatherId = ref()
const birthDate = ref()
const emailRules = ref([
    v => !!v || 'Email is required',
    // v => (v && v.length >= 3) || 'Name must be 3 characters atleast',
])
const nameRules = ref([
    v => !!v || 'Name is required',
    // v => (v && v.length >= 3) || 'Name must be 3 characters atleast',
])
const passwordRules = ref([
    v => !!v || 'Password is required',
])
const cPasswordRules = computed(() => {
    return [
        v => !!v || 'Confirm password is required',
        v => (v && v === password.value) || 'Password mismatch',
    ]
})
// const motherRules = ref([
//     v => !!v || 'Mother name is required',
// ])
// const fatherRules = ref([
//     v => !!v || 'Father name is required',
// ])
const gender = ref('')
const loading = ref(false)
const showInfo = computed(() => {
    return gender.value && gender.value.toLowerCase() === 'female'
})
const motherRules = computed(() => {
    return []
})

const fatherRules = computed(() => {
    return !showInfo.value
        ? [(v) => !!v || 'Father name is required']
        : []
})

const userData = computed(() => {
    return {
        email: email.value,
        password: password.value,
        name: name.value,
        password: password.value,
    }
})

onMounted(() => {
    reset()
})
const motherDataLoading = ref(false)
const fathersDataLoading = ref(false)

const validate = async () => {
    console.log(form.value);
    const { valid } = await form.value.validate()

    if (valid) register()
}
const register = async () => {
    loading.value = true
    UserService.register(userData.value)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            loading.value = false
            reset()
        })
}
const onInfoClick = () => {

}
function reset() {
    form.value.reset()
    motherId.value = null
    fatherId.value = null
}
function resetValidation() {
    form.value.resetValidation()
}
</script>