<template>
    <section>
        <client-only>
        <Login />
    </client-only>
    </section>
</template>


<script setup>
import Login from '~/components/RequestPassword.vue';
definePageMeta({
    layout: "",
});
</script>

<style lang="scss" scoped></style>