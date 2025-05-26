<template>

    <v-row justify="center" class="mb-4">
        <v-col cols="12" md="8">
            <v-card elevation="0">
                <!-- <v-timeline side="end">
                    <v-timeline-item v-for="item in items" :key="item.id" :dot-color="item.color" size="small">
                        <v-alert :color="item.color" :icon="item.icon" :value="true">
                            Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut,
                            sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando
                            voluptatibus, vix an salutandi sententiae.
                        </v-alert>
                    </v-timeline-item>
                </v-timeline> -->
                <v-tabs v-model="tab" bg-color="primary" dark>
                    <v-tab value="my-membership">My Membership</v-tab>
                    <v-tab value="family-members">Add Family Member</v-tab>
                </v-tabs>

                <v-window v-model="tab" v-if="hasAuthUserMembership">
                    <v-window-item value="my-membership">
                        <v-card class="mt-4" flat>
                            <v-card-text>
                                <div >
                                    <h3 class="text-h6">✅ You’re already registered for membership.</h3>
                                    <p>You can now add your family members.</p>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <!-- <v-window-item value="family-members">
                        <v-card class="mt-4" flat>
                            <v-card-text>
                                <div>
                                    <h3 class="text-h6 mb-2">Add family member.</h3>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-window-item> -->
                </v-window>

                <!-- <v-divider /> -->

                <v-row justify="center" class="mt-md-4 mb-4" v-if="(tab == 'my-membership' && !hasAuthUserMembership) || tab == 'family-members'">
                    <v-col cols="12" md="6">

                        <v-card elevation="3" class="pa-6">
                            <v-form ref="form" @submit.prevent="validate()" lazy-validation>
                                <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required
                                    prepend-inner-icon="mdi-account">
                                    <template #label>
                                        Name <span class="text-red">*</span>
                                    </template>
                                </v-text-field>

                                <v-select v-model="gender" :items="genders"
                                    :rules="[v => !!v || 'Gender selection is required']" label="Gender" required
                                    prepend-inner-icon="mdi-gender-male-female">
                                    <template #label>
                                        Gender <span class="text-red">*</span>
                                    </template>
                                </v-select>

                                <v-date-input :rules="[]" prepend-icon="" v-model="birthDate" label="Birth date"
                                    prepend-inner-icon="mdi-calendar"></v-date-input>
                                <v-autocomplete v-model="fatherId" :rules="fatherRules" label="Father Name"
                                    item-title="name" item-value="id" :items="fathersData" :loading="fathersDataLoading"
                                    prepend-inner-icon="mdi-magnify" @update:search="onFatherSearch">
                                    <template #append-inner v-if="showInfo">
                                        <v-tooltip
                                            text="Optional if the person is not originally part of the family tree">
                                            <template #activator="{ props }">
                                                <v-icon v-bind="props" class="me-2" color="primary" size="small"
                                                    style="cursor: pointer" @click.stop @mousedown.stop>
                                                    mdi-information
                                                </v-icon>
                                            </template>
                                        </v-tooltip>
                                    </template>
                                    <template #label>
                                        Father's Name <span v-if="!showInfo" class="text-red">*</span>
                                    </template>
                                </v-autocomplete>
                                <v-autocomplete v-model="motherId" :rules="motherRules" label="Mother Name"
                                    item-title="name" item-value="id" :items="mothersData"
                                    prepend-inner-icon="mdi-magnify" @update:search="onMotherSearch">
                                    <template #label>
                                        Mother's Name
                                    </template>
                                    <template #append-inner v-if="showInfo">
                                        <v-tooltip
                                            text="Optional if the person is not originally part of the family tree">
                                            <template #activator="{ props }">
                                                <v-icon v-bind="props" class="me-2" color="primary" size="small"
                                                    style="cursor: pointer" @click.stop @mousedown.stop>
                                                    mdi-information
                                                </v-icon>
                                            </template>
                                        </v-tooltip>
                                    </template>
                                </v-autocomplete>

                                <div class="d-flex flex-column flex-md-row justify-end ga-2 mt-6">
                                    <v-btn class="order-2 order-md-1" variant="tonal" color="error" @click="reset">
                                        <v-icon start>mdi-restore</v-icon>
                                        Reset data
                                    </v-btn>
                                    <v-btn class="order-1 order-md-2" color="success" type="submit" :loading="loading">
                                        <v-icon start>mdi-content-save</v-icon>
                                        Save member
                                    </v-btn>
                                </div>
                            </v-form>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="12" md="4" v-if="false">
            <v-card :class="mdAndUp ? 'flat elevation-2' : 'elevation-0 border-0'" class="pa-4 pa-md-8">
                <v-toolbar density="compact" class="mb-2">
                    <v-toolbar-title class="d-flex align-end">
                        <v-icon class="me-2" color="primary">
                            mdi-account-plus
                        </v-icon>
                        <span class="text-h6 font-weight-medium text-primary">Add New Member</span>
                    </v-toolbar-title>
                </v-toolbar>

                <v-form ref="form" @submit.prevent="validate()" lazy-validation>
                    <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required
                        prepend-inner-icon="mdi-account">
                        <template #label>
                            Name <span class="text-red">*</span>
                        </template>
                    </v-text-field>

                    <v-select v-model="gender" :items="genders" :rules="[v => !!v || 'Gender selection is required']"
                        label="Gender" required prepend-inner-icon="mdi-gender-male-female">
                        <template #label>
                            Gender <span class="text-red">*</span>
                        </template>
                    </v-select>

                    <v-date-input :rules="[]" prepend-icon="" v-model="birthDate" label="Birth date"
                        prepend-inner-icon="mdi-calendar"></v-date-input>
                    <v-autocomplete v-model="fatherId" :rules="fatherRules" label="Father Name" item-title="name"
                        item-value="id" :items="fathersData" :loading="fathersDataLoading"
                        prepend-inner-icon="mdi-magnify" @update:search="onFatherSearch">
                        <template #append-inner v-if="showInfo">
                            <v-tooltip text="Optional if the person is not originally part of the family tree">
                                <template #activator="{ props }">
                                    <v-icon v-bind="props" class="me-2" color="primary" size="small"
                                        style="cursor: pointer" @click.stop @mousedown.stop>
                                        mdi-information
                                    </v-icon>
                                </template>
                            </v-tooltip>
                        </template>
                        <template #label>
                            Father's Name <span v-if="!showInfo" class="text-red">*</span>
                        </template>
                    </v-autocomplete>
                    <v-autocomplete v-model="motherId" :rules="motherRules" label="Mother Name" item-title="name"
                        item-value="id" :items="mothersData" prepend-inner-icon="mdi-magnify"
                        @update:search="onMotherSearch">
                        <template #label>
                            Mother's Name
                        </template>
                        <template #append-inner v-if="showInfo">
                            <v-tooltip text="Optional if the person is not originally part of the family tree">
                                <template #activator="{ props }">
                                    <v-icon v-bind="props" class="me-2" color="primary" size="small"
                                        style="cursor: pointer" @click.stop @mousedown.stop>
                                        mdi-information
                                    </v-icon>
                                </template>
                            </v-tooltip>
                        </template>
                    </v-autocomplete>

                    <div class="d-flex flex-column flex-md-row justify-end ga-2 mt-6">
                        <v-btn class="order-2 order-md-1" variant="tonal" color="error" @click="reset">
                            <v-icon start>mdi-restore</v-icon>
                            Reset data
                        </v-btn>
                        <v-btn class="order-1 order-md-2" color="success" type="submit" :loading="loading">
                            <v-icon start>mdi-content-save</v-icon>
                            Save member
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-col>
    </v-row>

</template>
<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { MemberService } from '~/services/MemberService'
import { formatDate } from '@/utils/date'

import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, authUser, hasAuthUserMembership } = useAuth()
const { mdAndUp } = useDisplay()
const form = ref(null)

const genders = [
    'Male',
    'Female',
]

const tab = ref('my-membership')
const router = useRouter()

// Check from backend or localStorage

const name = ref('')
const mothersData = ref([])
const fathersData = ref([])
const motherId = ref()
const fatherId = ref()
const birthDate = ref()
const nameRules = ref([
    v => !!v || 'Name is required',
    // v => (v && v.length >= 3) || 'Name must be 3 characters atleast',
])
const dateRules = ref([
    v => !!v || 'Birthdate is required',
])
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
        name: name.value,
        mother_id: motherId.value,
        father_id: fatherId.value,
        gender: gender.value.toLocaleLowerCase(),
        birth_date: birthDate.value ? formatDate(birthDate.value) : null,
        membership_type: tab.value == 'my-membership' ? 'own' : 'family',
    }
})

onMounted(() => {
    // reset()
})
const motherDataLoading = ref(false)
const fathersDataLoading = ref(false)
const searchQuery = '&gender='
const getAllMothers = async (search = '') => {

    const query = search.length ? `?query=${search}&gender=female` : ''
    MemberService.getAll(query)
        .then((response) => {
            console.log(response.data, 'response');
            mothersData.value = response.data
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            motherDataLoading.value = false
            fathersDataLoading.value = false
        })
}
const getAllFathers = async (search = '') => {

    const query = search.length ? `?query=${search}&gender=male` : ''
    MemberService.getAll(query)
        .then((response) => {
            fathersData.value = response.data
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            motherDataLoading.value = false
            fathersDataLoading.value = false
        })
}
const onMotherSearch = (search) => {
    if (search && search.length) {
        motherDataLoading.value = true
        getAllMothers(search)
    } else {
        // mothersData.value = []
    }
}
const onFatherSearch = (search) => {
    if (search && search.length) {
        fathersDataLoading.value = true
        getAllFathers(search)
    } else {
        mothersData.value = []
    }
}
const validate = async () => {
    console.log(form.value);
    const { valid } = await form.value.validate()

    if (valid) saveNewFamilyMember()
}
const saveNewFamilyMember = async () => {
    loading.value = true
    MemberService.create(userData.value)
        .then((response) => {
            reset()
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            loading.value = false
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