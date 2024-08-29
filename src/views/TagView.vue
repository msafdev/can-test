<template>
    <div class="max-w-6xl mx-auto mb-8">
        <h1 class="text-2xl mt-8 mb-4 font-semibold">
            {{ tag ? `Games for Tag: "${tag.name}"` : 'Tag Not Found' }}
        </h1>

        
        <div v-if="isLoading" class="text-center py-4">
            <p>Loading...</p>
        </div>

        
        <div v-if="error" class="text-center py-4 text-red-500">
            <p>{{ error }}</p>
        </div>

        
        <div v-if="games.length && !isLoading"
            class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
            <GameCard v-for="game in games" :key="game.id" :game="game" />
        </div>

        
        <div v-else-if="!isLoading && games.length === 0" class="text-center py-4">
            <p>No games found for this tag.</p>
        </div>

        
        <div class="flex items-center justify-center mt-4 gap-x-3" v-if="totalPages > 1 && !isLoading">
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
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useGamesStore } from '../stores/game';
import GameCard from '../components/GameCard.vue';
import { Minus, Plus } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'TagView',
    components: {
        GameCard,
        Minus,
        Plus,
    },
    setup() {
        const store = useGamesStore();
        const route = useRoute();

        
        const isLoading = ref(false);
        const error = ref<string | null>(null);
        const currentPage = ref(1);

        
        const tagId = computed(() => Number(route.params.id));
        const tag = computed(() => store.tags.find(t => t.id === tagId.value));
        const games = computed(() => store.games);
        const totalPages = computed(() => Math.ceil(store.totalGames / 12)); 

        
        const fetchGamesByTag = async () => {
            if (!tagId.value) return;

            try {
                isLoading.value = true;
                error.value = null;
                await store.fetchGamesByTag(tagId.value, currentPage.value);
            } catch (err) {
                error.value = 'Failed to load games for this tag.';
            } finally {
                isLoading.value = false;
            }
        };

        
        watch([() => route.params.id, currentPage], fetchGamesByTag, { immediate: true });

        
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

        return {
            games,
            tag,
            isLoading,
            error,
            currentPage,
            totalPages,
            nextPage,
            prevPage,
        };
    },
});
</script>


