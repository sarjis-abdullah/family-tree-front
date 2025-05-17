<template>
    <section class="d-flex align-center justify-center" style="height: 75vh;">
        <client-only>
            <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6" elevation="10" rounded="xl">
          <v-card-title class="text-h5 text-center mb-4">
            👋 Welcome to the Khan Siddique Family group!
          </v-card-title>

          <v-card-subtitle class="text-center mb-6">
            What would you like to do today?
          </v-card-subtitle>

          <v-row dense>
            <v-col cols="12" sm="4">
              <v-btn
                color="primary"
                variant="flat"
                class="w-100"
                @click="$router.push('/add-member')"
              >
                <v-icon start>mdi-account-plus</v-icon>
                Add Member
              </v-btn>
            </v-col>

            <v-col cols="12" sm="4">
              <v-btn
                color="success"
                variant="flat"
                class="w-100"
                @click="$router.push('/family-tree')"
              >
                <v-icon start>mdi-account-group</v-icon>
                View Tree
              </v-btn>
            </v-col>

            <v-col cols="12" sm="4">
              <v-btn
                color="info"
                variant="flat"
                class="w-100"
                @click="$router.push('/find-relationship')"
              >
                <v-icon start>mdi-account-search</v-icon>
                Find Relation
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
        </client-only>
    </section>
</template>


<script setup>
definePageMeta({
    layout: "default",
});
</script>

<style scoped>
.v-btn {
  font-weight: 600;
}
</style>