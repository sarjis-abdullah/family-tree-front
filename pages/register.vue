<template>
    <section>
        <client-only>
        <Registration />
    </client-only>
    </section>
</template>


<script setup>
import Registration from '~/components/Registration.vue';
definePageMeta({
    layout: "",
});
</script>

<style lang="scss" scoped></style>