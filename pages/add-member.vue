<template>
    <section>
        <client-only>
        <AddNewFamilyMember />
    </client-only>
    </section>
</template>


<script setup>
import AddNewFamilyMember from '~/components/AddNewFamilyMember.vue';
definePageMeta({
    layout: "default",
});
</script>

<style lang="scss" scoped></style>