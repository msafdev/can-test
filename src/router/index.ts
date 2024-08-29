import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import DetailView from "@/views/DetailView.vue";
import FavoriteView from "@/views/FavoriteView.vue";
import TagView from "@/views/TagView.vue";
import StoreView from "@/views/StoreView.vue";
import GenreView from "@/views/GenreView.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/game/:id",
    name: "GameDetail",
    component: DetailView,
    props: true,
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: FavoriteView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: { name: "Home" },
  },
  {
    path: "/tag/:id",
    name: "TagView",
    component: TagView,
    props: true,
  },
  {
    path: "/store/:id",
    name: "StoreView",
    component: StoreView,
    props: true,
  },
  {
    path: "/genre/:id",
    name: "GenreView",
    component: GenreView,
    props: true,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
