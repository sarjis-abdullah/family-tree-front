<template>
    <section>
        <AddNewFamilyMember />

    </section>
</template>


<script setup>
import AddNewFamilyMember from '~/components/AddNewFamilyMember.vue';
definePageMeta({
    layout: "default",
    middleware: "auth"
});
</script>

<style lang="scss" scoped></style>