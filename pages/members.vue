<template>
    <section>
        <Members />
    </section>
</template>

<script setup>
import Members from '~/components/Members.vue';
definePageMeta({
    layout: "default",
    middleware: "auth"
});
</script>

<style lang="scss" scoped>

</style>