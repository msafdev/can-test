<script lang="ts">
import { defineComponent } from 'vue';
import { useDark, useToggle } from '@vueuse/core';
import { Sun } from 'lucide-vue-next';

export default defineComponent({
    name: 'DarkMode',
    components: {
        Sun,
    },
    setup() {
        const isDark = useDark();
        const toggleDark = useToggle(isDark);

        return {
            isDark,
            toggleDark,
        };
    },
});
</script>

<template>
    <button @click="toggleDark()"
        class="text-primary-foreground size-9 md:size-10 shrink-0 rounded-lg bg-primary flex items-center justify-center">
        <Sun :size="16" />
    </button>
</template>
