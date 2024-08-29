<template>
    <div class="max-w-6xl mx-auto mb-8">
        
        <h1 class="text-2xl mt-8 mb-4 font-semibold">
            {{ searchQuery ? `Search results for: "${searchQuery}"` : 'Popular Games' }}
        </h1>

        
        <div v-if="searchQuery === ''">
            
            <div v-if="games.length"
                class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
                <GameCard v-for="game in games" :key="game.id" :game="game" />
            </div>
            <p v-else>No games found.</p>

            
            <div class="flex items-center justify-center mt-4 gap-x-3" v-if="totalPages > 1">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="rounded flex items-center justify-center bg-primary text-primary-foreground size-8">
                    <Minus :size="20" />
                </button>
                <span class="mx-2 font-medium">{{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="rounded flex items-center justify-center bg-primary text-primary-foreground size-8">
                    <Plus :size="20" />
                </button>
            </div>
        </div>

        
        <div v-else>
            
            <div v-if="games.length"
                class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
                <GameCard v-for="game in games" :key="game.id" :game="game" />
            </div>
        </div>

        
        <div class="mt-8" v-if="genres.length">
            <h2 class="text-xl font-semibold mb-4">Genres</h2>
            <div class="flex flex-wrap gap-2">
                <div v-for="genre in genres" :key="genre.id" @click="navigateToGenre(genre.id)"
                    class="bg-secondary text-secondary-foreground text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 rounded-md cursor-pointer hover:bg-secondary-light">
                    {{ genre.name }}
                </div>
            </div>
        </div>

        
        <div class="mt-8" v-if="tags.length">
            <h2 class="text-xl font-semibold mb-4">Tags</h2>
            <div class="flex flex-wrap gap-2">
                <div v-for="tag in tags" :key="tag.id" @click="navigateToTag(tag.id)"
                    class="bg-secondary text-secondary-foreground text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 rounded-md cursor-pointer hover:bg-secondary-light">
                    {{ tag.name }}
                </div>
            </div>
        </div>

        
        <div class="mt-8" v-if="stores.length">
            <h2 class="text-xl font-semibold mb-4">Stores</h2>
            <div class="flex flex-wrap gap-2">
                <div v-for="store in stores" :key="store.id" @click="navigateToStore(store.id)"
                    class="bg-secondary text-secondary-foreground text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 rounded-md cursor-pointer hover:bg-secondary-light">
                    {{ store.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onMounted } from 'vue';
import { useGamesStore } from '../stores/game';
import GameCard from '../components/GameCard.vue';
import { Minus, Plus } from 'lucide-vue-next';
import router from '@/router';

export default defineComponent({
    components: {
        GameCard,
        Plus,
        Minus,
    },
    props: {
        searchQuery: {
            type: String,
            required: false,
            default: '',
        },
    },
    setup(props) {
        const store = useGamesStore();

        const currentPage = ref(1);
        const gamesPerPage = 12; 

        
        const games = computed(() => store.games);
        const genres = computed(() => store.genres);
        const tags = computed(() => store.tags);
        const stores = computed(() => store.stores);
        const totalPages = computed(() => Math.ceil(store.totalGames / gamesPerPage));

        
        watch(
            () => props.searchQuery,
            async (newQuery) => {
                currentPage.value = 1; 
                if (newQuery) {
                    await store.searchGames(newQuery, currentPage.value);
                } else {
                    await store.fetchGames(currentPage.value);
                    store.fetchGenres();  
                    store.fetchTags();    
                    store.fetchStores();  
                }
            },
            { immediate: true }
        );

        
        watch(currentPage, async (newPage) => {
            if (props.searchQuery) {
                await store.searchGames(props.searchQuery, newPage);
            } else {
                await store.fetchGames(newPage);
            }
        });

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const navigateToGenre = (id: number) => {
            router.push({ name: 'GenreView', params: { id } });
        };

        const navigateToTag = (id: number) => {
            router.push({ name: 'TagView', params: { id } });
        };

        const navigateToStore = (id: number) => {
            router.push({ name: 'StoreView', params: { id } });
        };


        
        onMounted(() => {
            if (!props.searchQuery) {
                store.fetchGenres();
                store.fetchTags();
                store.fetchStores();
            }
        });

        return {
            games,
            genres,
            tags,
            stores,
            searchQuery: props.searchQuery,
            currentPage,
            totalPages,
            nextPage,
            prevPage,
            navigateToGenre,
            navigateToTag,
            navigateToStore,
        };
    },
});
</script>
