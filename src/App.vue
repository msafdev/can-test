<template>
    <div id="app">
        <Navbar @search="handleSearch" />
        <router-view :search-query="searchQuery" class="px-4 sm:px-[6%] md:px-[8%]"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navbar from './components/Navbar.vue';
import { useGamesStore } from './stores/game';

export default defineComponent({
    name: 'App',
    components: {
        Navbar,
    },
    setup() {
        const searchQuery = ref('');
        const store = useGamesStore();

        const handleSearch = async (query: string) => {
            searchQuery.value = query;
            if (query) {
                await store.searchGames(query);
            } else {
                await store.fetchGames();
            }
        };

        store.fetchGames();

        return {
            searchQuery,
            handleSearch,
        };
    },
});
</script>