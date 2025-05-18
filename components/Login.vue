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
                    <h3 class="text-h6 font-weight-medium text-center">Sign in to your account</h3>
                </header>

                <v-form ref="form" @submit.prevent="validate()" lazy-validation>
                    <v-text-field v-model="email" :rules="emailRules" label="Email" required
                        prepend-inner-icon="mdi-mail" variant="solo">
                        <template #label>
                            Email <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    
                    <v-text-field type="password" v-model="password" :rules="passwordRules" label="Password" required
                        prepend-inner-icon="mdi-lock" variant="solo" class="mt-2" hide-details="auto">
                        <template #label>
                            Password <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                    <div class="text-right">
                        <a href="/forgot-password" class="text-primary text-caption">
                            Forgot Password?
                        </a>
                    </div>


                    <div class="d-flex ga-2 mt-6">
                        <v-btn class="order-1 order-md-2" size="large" style="width: 100%;" color="primary"
                            type="submit" :loading="loading">

                            Sign in
                            <v-icon class="ml-2" start>mdi-arrow-right</v-icon>
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
            <p class="text-center text-sm mt-4">Don't have an account yet?<br>
                <nuxt-link to="/register" class="font-bold text-base text-primary-600 hover:text-primary-500">
                    Register here
                </nuxt-link>
            </p>
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
        password: password.value,
    }
})

onMounted(() => {
    reset()
})

const validate = async () => {
    const { valid } = await form.value.validate()

    if (valid) login()
}
const router = useRouter()
const login = async () => {
    loading.value = true
    UserService.login(userData.value, '?include=user.members')
        .then((response) => {
            console.log(response);
            if (response.accessToken) {
                saveToken(response.accessToken)
                saveUser(response.user)
                window.location.href = '/dashboard'
                // router.push({ name: 'dashboard' })
            }
        })
        .catch((error) => {
            console.error(error);
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