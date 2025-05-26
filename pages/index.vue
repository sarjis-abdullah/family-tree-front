<template>
    <div>
        <v-btn color="primary">Hello from Vuetify 3 + Nuxt 3</v-btn>

    </div>
</template>


<script setup>
definePageMeta({
    layout: "default",
    middleware: "auth"
});
</script>

<style lang="scss" scoped></style>