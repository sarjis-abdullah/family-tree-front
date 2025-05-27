<template>
  <v-data-table-server v-model:items-per-page="perPage" :headers="headers" :items="serverItems"
    :items-length="totalItems" :loading="loading" :search="search" item-value="name" @update:options="loadItems"
    :items-per-page-options="[30, 50, 100]">
    <template v-slot:item.status="{ item }">
      <v-chip :color="item.status === 'active' ? 'green' : 'red'" dark>
        {{ item.status }}
      </v-chip>
    </template>
    <template v-slot:item.email_verified_at="{ item }">
      <span v-if="item.email_verified_at">{{ formatDate(item.email_verified_at) }}</span>
      <v-chip v-else :color="'red'" dark>
        Not Verified
      </v-chip>
    </template>
    <template v-slot:item.created_at="{ item }">
      <span v-if="item.created_at">{{ formatDate(item.created_at) }}</span>
    </template>
    <template #item.actions="{ item }">
      <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item
              @click="updateActivation(item)"
              >
                <v-list-item-title>{{ item.status === 'active' ? 'Deactivate' : 'Activate' }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
import { UserService } from '~/services/UserService';

const { isAuthenticated, authUser, hasAuthUserMembership } = useAuth()
const resource = ref({})
const headers = ref([
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: 'Email', key: 'email', align: 'end' },
  { title: 'Status', key: 'status', align: 'end' },
  { title: 'Verified At', key: 'email_verified_at', align: 'end' },
  { title: 'Created AT', key: 'created_at', align: 'end' },
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
  let query = `?page=${pageCount.value}&per_page=${perPage.value}`

  if (authUser.value) {
    // query += `&created_by=${authUser.value.id}`
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
const updateActivation = async (item) => {
  try {
    const response = await UserService.update(item.id, {
      status: item.status === 'active' ? 'inactive' : 'active'
    })
    if (response?.data) {
      // Update the local state
      serverItems.value = serverItems.value.map(user => {
        if (user.id === item.id) {
          return {
            ...user,
            status: response.data.status
          }
        }
        return user
      })
    }
  } catch (error) {
    console.error('Error updating user activation:', error)
  }
}

watch(
  searchQuery,
  async (newVal, oldVal) => {
    console.log('Search query changed:', newVal)
    try {
      const res = await UserService.getAll(searchQuery.value)
      serverItems.value = res?.data
      totalItems.value = res?.meta?.total || 0
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