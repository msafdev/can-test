<template>
    <div class="border-2 overflow-hidden w-full relative rounded-xl group cursor-pointer" @click="goToGameDetail">
        <img :src="game.background_image" :alt="game.name" class="w-full h-auto aspect-[9/12] object-cover" />
        <div
            class="absolute -bottom-full group-hover:bottom-0 transition-all duration-300 ease-in-out bg-card text-card-foreground w-full backdrop-blur p-3">
            <h2 class="text-sm font-semibold">{{ game.name }}</h2>
            <p class="text-xs font-medium text-muted-foreground">{{ game.metacritic }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { useRouter } from 'vue-router';  

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
    name: 'GameCard',
    props: {
        game: {
            type: Object as PropType<Game>,
            required: true,
        },
    },
    setup(props) {
        const router = useRouter(); 

        const goToGameDetail = () => {
            router.push({ name: 'GameDetail', params: { id: props.game.id } });  
        };

        return {
            goToGameDetail,
        };
    },
});
</script>
