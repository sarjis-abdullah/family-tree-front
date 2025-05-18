<template>
    <v-row justify="center" class="mt-md-4">
        <v-col cols="12" md="6">

            <v-card elevation="2">
                <v-tabs v-model="activeTab" color="primary" background-color="grey-lighten-4" grow>
                    <v-tab v-for="(tab, index) in tabs" :key="index" :value="tab.value">
                        <v-icon start>{{ tab.icon }}</v-icon>
                        {{ tab.label }}
                    </v-tab>
                </v-tabs>

                <v-divider />

                <v-card-text>
                    {{ activeTab }}
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
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('self')

const tabs = [
    { label: 'Add Myself', value: 'self', icon: 'mdi-account' },
    { label: 'Add Child', value: 'child', icon: 'mdi-baby-face-outline' },
    { label: 'Add Sibling', value: 'sibling', icon: 'mdi-account-multiple' },
    { label: 'Add Spouse', value: 'spouse', icon: 'mdi-ring' },
    { label: 'Add Parent', value: 'parent', icon: 'mdi-account-tie' }
]

// Dynamic component loading
function getFormComponent(type) {
    switch (type) {
        case 'self': return AddSelfForm
        case 'child': return AddChildForm
        case 'sibling': return AddSiblingForm
        case 'spouse': return AddSpouseForm
        case 'parent': return AddParentForm
        default: return DefaultForm
    }
}

// Import your form components
//   import AddSelfForm from '@/components/forms/AddSelfForm.vue'
//   import AddChildForm from '@/components/forms/AddChildForm.vue'
//   import AddSiblingForm from '@/components/forms/AddSiblingForm.vue'
//   import AddSpouseForm from '@/components/forms/AddSpouseForm.vue'
//   import AddParentForm from '@/components/forms/AddParentForm.vue'
//   import DefaultForm from '@/components/forms/DefaultForm.vue'
</script>