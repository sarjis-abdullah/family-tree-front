<template>
    <section>
        <RelationFinder />
    </section>
</template>

<script setup>
import RelationFinder from '~/components/RelationFinder.vue';
definePageMeta({
    layout: "default",
    middleware: "auth"
});
</script>

<style lang="scss" scoped>

</style>