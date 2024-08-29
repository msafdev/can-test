<template>
    <nav class="flex flex-col gap-y-4 px-4 sm:px-[6%] md:px-[8%] py-8">
        <div class="flex items-center w-full">
            <div class="navbar__logo shrink-0 bg-white p-0.5 rounded-lg size-9 md:size-10">
                <router-link to="/">
                    <img src="../assets/logo.png" alt="Logo" />
                </router-link>
            </div>
            <div class="flex flex-row-reverse w-full md:w-fit md:ml-auto items-center gap-x-2">
                <router-link to="/favorites"
                    class="size-9 md:size-10 shrink-0 rounded-lg bg-rose-400 flex items-center justify-center">
                    <button class="text-white">
                        <Heart :size="16" />
                    </button>
                </router-link>
                <DarkMode />
                <input type="text" v-model="searchQuery" @keydown.enter="onSearch" placeholder="Search games..."
                    class="border rounded-lg h-9 md:h-10 px-3 w-full md:w-64 text-foreground bg-background hidden md:block" />
            </div>
        </div>
        <input type="text" v-model="searchQuery" @keydown.enter="onSearch" placeholder="Search games..."
            class="border rounded-lg h-9 md:h-10 px-3 w-full md:w-64 text-foreground bg-background md:hidden" />
    </nav>
</template>

<script lang="ts">
import { Heart } from 'lucide-vue-next';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router'; 
import DarkMode from './DarkMode.vue';

export default defineComponent({
    name: 'Navbar',
    components: {
        Heart,
        DarkMode
    },
    setup(_, { emit }) {
        const searchQuery = ref('');
        const router = useRouter(); 

        const onSearch = (event: Event) => {
            const target = event.target as HTMLInputElement;
            searchQuery.value = target.value;

            if (searchQuery.value.trim()) {
                emit('search', searchQuery.value); 
                router.push('/'); 
            }
        };

        return {
            onSearch,
            searchQuery,
        };
    },
});
</script>
