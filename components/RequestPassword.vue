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
                    <nuxt-link to="/login" class="text-primary text-caption">
                        <v-icon class="mr-2" size="24">mdi-arrow-left</v-icon>
                    </nuxt-link>
                    <h3 class="text-h6 font-weight-medium text-center">

                        Forgotten your password?
                    </h3>
                </header>
                <figure class="mb-4 text-center">
                    <v-avatar class="mb-4 text-center" size="100" color="primary">
                        <v-img src="/forgetpassword.png" alt="KS Family Logo"></v-img>
                    </v-avatar>
                </figure>

                <v-form ref="form" @submit.prevent="validate()" lazy-validation v-if="!isEmailSent && !errorText">
                    <v-text-field v-model="email" :rules="emailRules" label="Email" required
                        prepend-inner-icon="mdi-mail" variant="solo">
                        <template #label>
                            Email <span class="text-red">*</span>
                        </template>
                    </v-text-field>


                    <div class="d-flex ga-2 mt-6">
                        <v-btn class="order-1 order-md-2" size="large" style="width: 100%;" color="primary"
                            type="submit" :loading="loading">

                            Submit
                            <v-icon class="ml-2" start>mdi-arrow-right</v-icon>
                        </v-btn>
                    </div>
                </v-form>
                <v-alert v-if="isEmailSent" type="success" class="mt-4">
                    An email has been sent to your registered email address with instructions to reset your password.
                </v-alert>
                <v-alert v-if="errorText" type="error" class="mt-4" @click="()=> {
                    errorText = ''
                    email = ''
                }">
                    {{errorText}}
                </v-alert>
            </v-card>
        </v-col>
    </v-row>

</template>
<script setup>
import { ref } from 'vue'
import { UserService } from '~/services/UserService'
import { useDisplay } from 'vuetify'
import { saveToken, saveUser } from '~/storage/tokenStorage'

const { mdAndUp } = useDisplay()
const form = ref(null)

const email = ref('')
const password = ref()
const emailRules = ref([
    v => !!v || 'Email is required',
])
const passwordRules = ref([
    v => !!v || 'Password is required',
])
const gender = ref('')
const loading = ref(false)
const showInfo = computed(() => {
    return gender.value && gender.value.toLowerCase() === 'female'
})

const userData = computed(() => {
    return {
        email: email.value,
    }
})

onMounted(() => {
    reset()
})

const validate = async () => {
    const { valid } = await form.value.validate()

    if (valid) login()
}
const isEmailSent = ref(false)
const errorText = ref(false)
const login = async () => {
    loading.value = true
    UserService.forgetPassword(userData.value)
        .then((response) => {
            isEmailSent.value = true

        })
        .catch((error) => {
            errorText.value = error.status
        })
        .finally(() => {
            loading.value = false
            reset()
        })
}

function reset() {
    form.value.reset()
}
function resetValidation() {
    form.value.resetValidation()
}
</script>