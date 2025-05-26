<template>
    <section>
        <Activities />
    </section>
</template>

<script setup>
import Activities from '~/components/Activities.vue';
definePageMeta({
    layout: "default",
    middleware: "auth"
});
</script>

<style lang="scss" scoped>

</style>