<template>
  <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
    :items-length="totalItems" :loading="loading" :search="search" item-value="name" @update:options="loadItems">

    <template #item.actions="{ item }">
      <v-icon icon @click="editItem(item)">mdi-pencil</v-icon>
      <!-- <v-icon color="red" @click="deleteItem(item)">mdi-delete</v-icon> -->
    </template>
  </v-data-table-server>
</template>
<script setup>
import { ref } from 'vue'
import { MemberService } from '~/services/MemberService'
import { useAuth } from '@/composables/useAuth'
import { formatDate, fromNow, isAfter } from '@/utils/date'

const { isAuthenticated, authUser, hasAuthUserMembership } = useAuth()
const desserts = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    iron: '1',
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    iron: '0',
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    iron: '6',
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    iron: '7',
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    iron: '16',
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    iron: '1',
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: '2',
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: '8',
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: '45',
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    iron: '22',
  },
]
const FakeAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage
        const items = desserts.slice()
        if (sortBy.length) {
          const sortKey = sortBy[0].key
          const sortOrder = sortBy[0].order
          items.sort((a, b) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          })
        }
        const paginated = items.slice(start, end === -1 ? undefined : end)
        resolve({ items: paginated, total: items.length })
      }, 500)
    })
  },
}
const itemsPerPage = ref(5)
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
const totalItems = ref(0)

const searchQuery = computed(() => {
  let query = `?page=1&per_page=${itemsPerPage.value}&include=user.father,user.mother`

  if (authUser.value) {
    query += `&created_by=${authUser.value.id}`
  }
  return query
})
function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = false
  console.log(page, itemsPerPage);
  MemberService.getAll()
  //   FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
  //     serverItems.value = items
  //     totalItems.value = total
  //     loading.value = false
  //   })
}

function editItem(item) {
  // Open dialog or navigate to edit page
  console.log('Edit', item)
}
function deleteItem(item) {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    // API call or action
    console.log('Delete', item)
  }
}

watch(
  searchQuery,
  async (newVal, oldVal) => {
    console.log('Search query changed:', newVal)
    // console.log(page, itemsPerPage);
    try {
      const res = await MemberService.getAll(searchQuery.value)
      serverItems.value = res?.data?.map(i => {
        return {
          ...i,
          mother: i?.mother?.name,
          father: i?.father?.name,
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