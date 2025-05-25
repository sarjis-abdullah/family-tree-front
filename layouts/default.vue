<template>
    <v-app>
        <v-app-bar app-bar>
            <v-app-bar-title class="d-flex flex-column">
                <div class="d-flex align-center">
                    <v-list>
                        <v-list-item :subtitle="'History & connections'" :title="'KS Family'" to="/dashboard">
                            <template v-slot:prepend>
                                <v-avatar :color="'blue'" src>
                                    <v-img alt="John" src="/logo.jpg"></v-img>
                                </v-avatar>
                            </template>
                        </v-list-item>
                    </v-list>
                </div>
            </v-app-bar-title>


            <template v-slot:append>
                <!-- Desktop -->
                <v-btn v-for="(item, index) in navs" :key="index" :value="index" :to="item.to" class="d-none d-md-flex"
                    color="primary">
                    <v-icon class="me-2" color="primary" size="small" style="cursor: pointer">
                        {{ item.icon }}
                    </v-icon>
                    {{ item.title }}
                </v-btn>

                <!-- Mobile -->
                <template>
                    <div class="text-center">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                            </template>

                            <v-list>
                                <v-list-item v-for="(item, index) in navs" :key="index" :value="index" :to="item.to"
                                    v-if="!mdAndUp">
                                    <template v-slot:prepend>
                                        <v-icon class="" color="primary" size="small" style="cursor: pointer">
                                            {{ item.icon }}
                                        </v-icon>
                                    </template>
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-for="(item, index) in profileNavs" :key="index" :value="index"
                                    :to="item.to">
                                    <template v-slot:prepend>
                                        <v-icon class="" color="primary" size="small" style="cursor: pointer">
                                            {{ item.icon }}
                                        </v-icon>
                                    </template>
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </template>
            </template>
        </v-app-bar>
        <v-main>
            <v-container>
                <NuxtPage />
            </v-container>
        </v-main>
    </v-app>
</template>
<script setup>
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, authUser, hasAuthUserMembership } = useAuth()

const profileNavs = computed(() => {
    return [
        {
            title: 'Profile',
            icon: 'mdi-account-circle',
            to: '/profile'
        },
        {
            title: 'Your activities',
            icon: 'mdi-cog',
            to: '/activities'
        },
        {
            title: 'Logout',
            icon: 'mdi-logout',
            to: '/logout'
        }
    ]
})
const navs = computed(() => {
    return [
        {
            title: 'Membership',
            icon: 'mdi-account-plus',
            to: '/add-member'
        },
        {
            title: 'View Family Tree',
            icon: 'mdi-account-group',
            to: '/family-tree'
        },
        {
            title: 'Find Relationship',
            icon: 'mdi-account-search',
            to: '/find-relationship'
        },
    ]
})

const mdAndUpNavs = [
    {
        title: 'Membership',
        icon: 'mdi-account-plus',
        to: '/add-member'
    },
    {
        title: 'View Family Tree',
        icon: 'mdi-account-group',
        to: '/family-tree'
    },
    {
        title: 'Find Relationship',
        icon: 'mdi-account-search',
        to: '/find-relationship'
    }
]
</script>