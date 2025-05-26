<template>
    <section>
        <FamilyTree v-if="rootNode && Object.keys(rootNode).length" :rootNode="rootNode"/>

    </section>
</template>


<script setup>
import FamilyTree from '~/components/FamilyTree.vue';
import { UserService } from '~/services/UserService'

definePageMeta({
    layout: "default",
    middleware: "auth"
});
const rootNode = ref({})
const loadUsers = async () => {
    const response = await UserService.getTree('')
    rootNode.value = response?.data?.original[0];
}

onMounted(() => {
    loadUsers()
});
</script>

<style lang="scss" scoped></style>