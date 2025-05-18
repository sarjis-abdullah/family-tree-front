<template>
    <section>
        <client-only>
        You have been logged out successfully.
    </client-only>
    </section>
</template>


<script setup>
import {clearAuthData} from '~/storage/tokenStorage.js';
definePageMeta({
    layout: "default",
});
const router = useRouter();
onMounted(() => {
    // Clear the token from local storage
  
    clearAuthData()
    router.push('/login')
});
</script>

<style lang="scss" scoped></style>