<template>
  <v-card :disabled="loading" :loading="loading" class="mx-auto my-12" max-width="374">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
    </template>

    <!-- <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" cover></v-img> -->

    <v-list lines="two" v-if="authUser">
      <v-list-item :subtitle="authUser.email" :title="authUser.name">
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="mx-4 mb-4"></v-divider>
    <v-card-title>
      <v-icon start icon="mdi-account" class="me-2" />
      Member Profile
    </v-card-title>

    <v-card-text v-if="member">
      <v-row>
        <v-col cols="12" >
          <strong>Name:</strong> {{ member.name }}
        </v-col>
        <v-col cols="12" >
          <strong>Gender:</strong> {{ member.gender }}
        </v-col>

        <v-col cols="12" >
          <strong>Father:</strong> {{ member.father ?? '--' }}
        </v-col>
        <v-col cols="12" >
          <strong>Mother:</strong> {{ member.mother ?? '--' }}
        </v-col>

        <v-col cols="12" >
          <strong>Birth Date:</strong> {{ member.birth_date ? formatDate(member.birth_date) : 'N/A' }}
        </v-col>
        <v-col cols="12" >
          <strong>Death Date:</strong> {{ member.death_date ? formatDate(member.death_date) : 'N/A' }}
        </v-col>

        <v-col cols="12" >
          <strong>Created By:</strong> {{ member.created_by ? member.created_by.name : '' }}
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn color="deep-purple-lighten-2" text="Edit" block border @click="reserve"></v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, authUser, hasAuthUserMembership } = useAuth()
// const member = computed(() => {
//   if (authUser.value?.members?.length) {
//     const member = authUser.value?.members.find(i => i.membership_type == 'own')
//     return member ? member : null
//   }
//   return null
// })

import { ref } from 'vue'
import { MemberService } from '~/services/MemberService'

const loading = ref(false)
const selection = ref(1)
function reserve() {
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}

const member = ref()

onMounted(async () => {
  if (authUser.value.id) {
    const query = '?include=user.created_by&membership_type=own&created_by=' + authUser.value.id
    const res = await MemberService.getAll(query)
    member.value = res?.data?.length ? res.data[0] : null
  }

})
</script>