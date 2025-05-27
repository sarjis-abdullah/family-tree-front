<template>
  <v-data-table-server v-model:items-per-page="perPage" :headers="headers" :items="serverItems"
    :items-length="totalItems" :loading="loading" :search="search" item-value="name" @update:options="loadItems" :items-per-page-options="[30, 50, 100]">

    <template #item.actions="{ item }">
      <v-icon icon @click="editItem(item)">mdi-pencil</v-icon>
      <!-- <v-icon color="red" @click="deleteItem(item)">mdi-delete</v-icon> -->
    </template>
  </v-data-table-server>
  <v-dialog v-model="editModal" width="600">
    <EditMember @close="editModal = false" @member-updated="handleMemberUpdate" :resource="resource">

    </EditMember>
  </v-dialog>
</template>
<script setup>
import { ref } from 'vue'
import { MemberService } from '~/services/MemberService'
import { useAuth } from '@/composables/useAuth'
import { formatDate, fromNow, isAfter } from '@/utils/date'
import EditMember from './EditMember.vue';

const { isAuthenticated, authUser, hasAuthUserMembership } = useAuth()
const resource = ref({})
const headers = ref([
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: 'Gender', key: 'gender', align: 'end' },
  { title: 'Father', key: 'father', align: 'end' },
  { title: 'Mother', key: 'mother', align: 'end' },
  { title: 'Birth date', key: 'birth_date', align: 'end' },
  { title: 'Death date', key: 'death_date', align: 'end' },
  { title: 'Created at', key: 'created_at', align: 'end' },
  { title: 'Actions', key: 'actions', align: 'end' },
])
const search = ref('')
const serverItems = ref([])
const loading = ref(true)
const editModal = ref(false)
const totalItems = ref(0)
const pageCount = ref(1)
const perPage = ref(10)
const sortBy = ref('name')

const searchQuery = computed(() => {
  let query = `?page=${pageCount.value}&per_page=${perPage.value}&include=m.father,m.mother`

  if (authUser.value) {
    query += `&created_by=${authUser.value.id}`
  }
  return query
})
function loadItems({ page, itemsPerPage, sortBy }) {
  pageCount.value = page || 1
  perPage.value = itemsPerPage || 10
}

function editItem(item) {
  // Open dialog or navigate to edit page
  console.log('Edit', item)
  editModal.value = true
  resource.value = item
}
function deleteItem(item) {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    // API call or action
    console.log('Delete', item)
  }
}
const handleMemberUpdate = (updatedMember) => {
  // Update the serverItems with the updated member
  serverItems.value = serverItems.value.map(item => {
    if (item.id === updatedMember.id) {
      return {
        ...item,
        ...updatedMember,
        mother: updatedMember.mother || item.mother,
        father: updatedMember.father || item.father,
        death_date: updatedMember.death_date ? formatDate(updatedMember.death_date) : '',
        birth_date: updatedMember.birth_date ? formatDate(updatedMember.birth_date) : '',
      }
    }
    return item
  })
  editModal.value = false
}

watch(
  searchQuery,
  async (newVal, oldVal) => {
    console.log('Search query changed:', newVal)
    try {
      const res = await MemberService.getAll(searchQuery.value)
      serverItems.value = res?.data?.map(i => {
        return {
          ...i,
          mother: i?.mother,
          father: i?.father,
          death_date: i.death_date ? formatDate(i.death_date) : '',
          birth_date: i.birth_date ? formatDate(i.birth_date) : '',
          created_at: i.birth_date ? formatDate(i.birth_date) : ''
        }
      })
    } catch (error) {

    } finally {
      loading.value = false
    }
  },
  {
    immediate: true,
    deep: true, // Only needed if `searchQuery` is an object or array (not needed for plain strings)
  }
)
</script>