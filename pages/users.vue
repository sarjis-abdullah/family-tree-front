<template>
    <section>
        <Users />
    </section>
</template>

<script setup>
import Users from '~/components/Users.vue';
definePageMeta({
    layout: "default",
    middleware: "auth"
});
</script>

<style lang="scss" scoped>

</style>