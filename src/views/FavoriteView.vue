<template>
    <div class="max-w-6xl mx-auto mb-8">
        <h1 class="text-xl md:text-2xl font-semibold mb-4">My Favorites</h1>

        <div v-if="favorites.length"
            class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
            <div v-for="game in favorites" :key="game.id" @click="() => goToGameDetail({ game })"
                class="border-2 overflow-hidden w-full relative rounded-xl group cursor-pointer">
                <img :src="game.background_image" :alt="game.name" class="w-full h-auto aspect-[9/12] object-cover" />
                <div
                    class="absolute -bottom-full group-hover:bottom-0 transition-all duration-300 ease-in-out bg-card text-card-foreground w-full backdrop-blur p-3">
                    <h2 class="text-sm font-semibold">{{ game.name }}</h2>
                    <p class="text-xs font-medium text-muted-foreground">{{ game.metacritic }}</p>
                </div>
            </div>
        </div>
        <p v-else>No favorites yet. Add some games to your favorites!</p>
    </div>
</template>

<script lang="ts">
import router from '@/router';
import { defineComponent, ref, onMounted, type PropType } from 'vue';

interface Game {
    id: number;
    name: string;
    background_image: string;
    metacritic: number;
}

export default defineComponent({
    name: 'FavoriteView',
    props: {
        game: {
            type: Object as PropType<Game>,
            required: true,
        },
    },
    setup() {
        const favorites = ref<Game[]>([]);

        onMounted(() => {
            const storedFavorites = localStorage.getItem('favorites');
            favorites.value = storedFavorites ? JSON.parse(storedFavorites) : [];
        });

        const goToGameDetail = (props: { game: Game }) => {
            router.push({ name: 'GameDetail', params: { id: props.game.id } });  
        };

        return { favorites, goToGameDetail };
    },
});
</script>
