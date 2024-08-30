<template>
    <div v-if="game" class="max-w-6xl mx-auto mb-8">
        <div class="flex my-4 justify-between items-center flex-wrap">
            <h1 class="text-xl md:text-2xl font-semibold">{{ game.name }}</h1>

            <button @click="toggleFavorite" class="px-3 py-1 rounded-md text-sm"
                :class="isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'">
                {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
            </button>
        </div>
        <img :src="game.background_image" :alt="game.name" class="rounded-xl mb-4">

        <!-- Iterate over screenshots array to display each screenshot -->
        <div v-if="screenshots.length" class="grid grid-cols-2 md:flex items-center gap-4 mb-4">
            <div v-for="screenshot in screenshots" :key="screenshot.id">
                <img :src="screenshot.image" :alt="'Screenshot ' + screenshot.id" class="rounded-xl">
            </div>
        </div>

        <div class="flex justify-between items-center">
            <div>
                <h2 class="font-medium text-lg mb-3">Available on:</h2>
                <ul class="flex gap-2 flex-wrap">
                    <li v-for="platform in game.platforms" :key="platform.platform.id"
                        class="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-md">
                        {{ platform.platform.name }}
                    </li>
                </ul>
            </div>
            <div v-if="game.metacritic" class="flex flex-col items-center">
                <p class="text-sm font-medium size-9 flex items-center justify-center border-2 rounded-full"
                    :class="metacriticColorClass">{{ game.metacritic }}</p>
            </div>
            <div v-else>
                <p
                    class="text-sm font-medium text-gray-500 border-gray-500 size-9 flex items-center justify-center border-2 rounded-full">
                    N/A</p>
            </div>
        </div>


        <div v-if="game.tags.length" class="mt-4">
            <h2 class="font-medium text-lg mb-3">Tags:</h2>
            <ul class="flex gap-2 flex-wrap">
                <li v-for="tag in game.tags" :key="tag.id"
                    class="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-md">
                    {{ tag.name }}
                </li>
            </ul>
        </div>


        <div v-if="game.genres.length" class="mt-4">
            <h2 class="font-medium text-lg mb-3">Genres:</h2>
            <ul class="flex gap-2 flex-wrap">
                <li v-for="genre in game.genres" :key="genre.id"
                    class="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-md">
                    {{ genre.name }}
                </li>
            </ul>
        </div>


        <div v-if="game.stores.length" class="mt-4">
            <h2 class="font-medium text-lg mb-3">Available at:</h2>
            <ul>
                <li v-for="store in game.stores" :key="store.id" class="text-sm">
                    <a :href="'https://' + store.store.domain" target="_blank" class="font-mono hover:underline">
                        {{ store.store.name }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <p v-else>Loading game details...</p>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGamesStore } from '../stores/game';

interface Platform {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    year_end: number | null;
    year_start: number | null;
    games_count: number;
    image_background: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
}

interface Genre {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
}

interface Store {
    id: number;
    name: string;
    slug: string;
    domain: string;
    games_count: number;
    image_background: string;
}

interface ScreenShot {
    id: number;
    image: string;
}

interface Game {
    id: number;
    name: string;
    background_image: string;
    metacritic: number;
    platforms: Array<{
        platform: Platform;
        released_at: string;
        requirements_en?: {
            minimum: string;
            recommended: string;
        } | null;
        requirements_ru?: string | null;
    }>;
    tags: Tag[];
    genres: Genre[];
    stores: Array<{
        id: number;
        store: Store;
    }>;
}

export default defineComponent({
    name: 'DetailView',
    setup() {
        const store = useGamesStore();
        const route = useRoute();
        const game = computed<Game | undefined>(() => store.getGameById(Number(route.params.id)));
        const screenshots = computed<ScreenShot[]>(() => store.screenshots);
        const isFavorite = ref(false);

        const metacriticColorClass = computed(() => {
            if (game.value === undefined || game.value.metacritic === null) {
                return 'text-gray-500 border-gray-500';
            } else if (game.value.metacritic > 80) {
                return 'text-green-500 border-green-500';
            } else if (game.value.metacritic > 50) {
                return 'text-yellow-500 border-yellow-500';
            } else {
                return 'text-red-500 border-red-500';
            }
        });

        const fetchData = () => {
            store.fetchGame(Number(route.params.id));
            store.fetchScreenshots(Number(route.params.id));
            checkFavoriteStatus();
        };

        onMounted(() => {
            fetchData();
        });

        // Watch for route changes and re-fetch data
        watch(
            () => route.params.id,
            (newId: string | string[], oldId: string | string[]) => {
                if (newId !== oldId) {
                    fetchData();
                }
            }
        );

        const toggleFavorite = () => {
            if (game.value) {
                const favorites = getFavoritesFromLocalStorage();
                const index = favorites.findIndex(favGame => favGame.id === game.value!.id);

                if (index > -1) {
                    favorites.splice(index, 1);
                    isFavorite.value = false;
                } else {
                    favorites.push(game.value);
                    isFavorite.value = true;
                }

                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        };

        const checkFavoriteStatus = () => {
            const favorites = getFavoritesFromLocalStorage();
            isFavorite.value = favorites.some(favGame => favGame.id === game.value?.id);
        };

        const getFavoritesFromLocalStorage = (): Game[] => {
            const favorites = localStorage.getItem('favorites');
            return favorites ? JSON.parse(favorites) : [];
        };

        return { game, screenshots, metacriticColorClass, isFavorite, toggleFavorite };
    },
});
</script>