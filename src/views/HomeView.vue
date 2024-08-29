<template>
  <div>
    <Welcome />
    <GameList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GameList from '../components/GameList.vue';
import Welcome from '@/components/Welcome.vue';

export default defineComponent({
  components: { GameList, Welcome },
});
</script>

<style scoped></style>
