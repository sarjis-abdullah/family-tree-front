<template>
    <section>
        <client-only>
        <ResetPassword />
    </client-only>
    </section>
</template>


<script setup>
import ResetPassword from '~/components/ResetPassword.vue';
definePageMeta({
    layout: "",
});
</script>

<style lang="scss" scoped></style>