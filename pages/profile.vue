<template>
    <section>
        <client-only>
        <Profile />
    </client-only>
    </section>
</template>


<script setup>
import Profile from '~/components/Profile.vue';
definePageMeta({
    layout: "default",
});
</script>

<style lang="scss" scoped></style>