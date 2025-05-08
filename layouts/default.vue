<template>
    <v-app>
        <v-app-bar app-bar>
            <v-app-bar-title>Khan Siddique Family</v-app-bar-title>
            <template v-slot:append>
                <v-btn to="/add-member">Add Family Member</v-btn>
                <v-btn to="/family-tree">View tree</v-btn>



                <v-btn icon="mdi-dots-vertical"></v-btn>
            </template>
        </v-app-bar>
        <v-main>
            <v-container>
                <NuxtPage />
            </v-container>
        </v-main>
    </v-app>
</template>