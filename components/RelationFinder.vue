<template>
    <v-card class="pa-4" elevation="0">
        <v-row dense class="justify-center">
            <v-col cols="12" md="3">
                <v-autocomplete v-model="personA" :items="personAUsers" label="Enter name of Person A"
                    placeholder="e.g. Abdul Hakim" item-title="name" item-value="id" clearable
                    prepend-inner-icon="mdi-magnify" @update:search="getPersonUsersA" />
            </v-col>

            <v-col cols="12" md="3">
                <v-autocomplete v-model="personB" :items="personBUsers" item-title="name" item-value="id" clearable
                    prepend-inner-icon="mdi-magnify" label="Enter name of Person A" placeholder="e.g. Nasir Uddin Khan"
                    @update:search="getPersonUsersB" />
            </v-col>

            <v-col cols="12" md="2" class="d-flex align-center">
                <v-btn color="primary" @click="findRelationship" :disabled="!personA || !personB || findingRelation">
                    Search
                </v-btn>
            </v-col>
        </v-row>
        <section class="mt-4">
            <FamilyTree v-if="rootNode && Object.keys(rootNode).length" :rootNode="rootNode"/>
        </section>
    </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { UserService } from '~/services/UserService'
import { MemberService } from '~/services/MemberService'
import FamilyTree from '~/components/FamilyTree.vue';
const personA = ref(null)
const personB = ref(null)
const userLoading = ref(false)
const findingRelation = ref(false)
const personBUsers = ref([])
const personAUsers = ref([])
const relationshipData = ref({})
const rootNode = ref({})

// Mock API call – Replace with actual API call to fetch users
onMounted(async () => {
    // Example static data

})

const findRelationship = () => {
    console.log('Finding relationship between:', personA.value, personB.value)
    const query = `?person_a=${personA.value}&person_b=${personB.value}`
    findingRelation.value = true
    MemberService.findRelationship(query)
        .then((response) => {
            if (response?.tree && Object.keys(response.tree).length) {
                rootNode.value = response.tree
            } else {
                alert('No relationship found')
                
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            findingRelation.value = false
        })
}
const getPersonUsersA = async (search = '') => {
    userLoading.value = true
    const query = search.length ? `?query=${search}` : ''
    MemberService.getAll(query)
        .then((response) => {
            personAUsers.value = response.data
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            userLoading.value = false
        })
}
const getPersonUsersB = async (search = '') => {
    userLoading.value = true
    const query = search.length ? `?query=${search}` : ''
    MemberService.getAll(query)
        .then((response) => {
            personBUsers.value = response.data
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            userLoading.value = false
        })
}
</script>

<style scoped>
.v-btn {
    width: 100%;
}
</style>