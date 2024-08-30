import { defineStore } from "pinia";
import axios from "axios";

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

const API_KEY = import.meta.env.VITE_API_KEY;

export const useGamesStore = defineStore("games", {
  state: () => ({
    games: [] as Game[],
    totalGames: 0,
    genres: [] as Genre[],
    tags: [] as Tag[],
    stores: [] as Store[],
    screenshots: [] as ScreenShot[],
  }),
  actions: {
    async fetchGames(page: number = 1) {
      try {
        const { data } = await axios.get<{ results: Game[]; count: number }>(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=12&page=${page}`
        );
        this.games = data.results;
        this.totalGames = data.count;
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    },
    async searchGames(query: string, page: number = 1) {
      try {
        const { data } = await axios.get<{ results: Game[]; count: number }>(
          `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=12&page=${page}`
        );
        this.games = data.results;
        this.totalGames = data.count;
      } catch (error) {
        console.error("Failed to search games:", error);
      }
    },
    async fetchGame(id: number) {
      if (!this.games.find((game) => game.id === id)) {
        try {
          const { data } = await axios.get<Game>(
            `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
          );
          this.games.push(data);
        } catch (error) {
          console.error("Failed to fetch game:", error);
        }
      }
    },
    getGameById(id: number): Game | undefined {
      return this.games.find((game) => game.id === id);
    },
    async fetchGenres() {
      try {
        const { data } = await axios.get<{ results: Genre[] }>(
          `https://api.rawg.io/api/genres?key=${API_KEY}`
        );
        this.genres = data.results;
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    },
    async fetchScreenshots(id: number) {
      try {
        const { data } = await axios.get<{ results: ScreenShot[] }>(
          `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`
        );
        this.screenshots = data.results; // Save the array of screenshots
      } catch (error) {
        console.error("Failed to fetch screenshots:", error);
      }
    },
    getScreenshotById(id: number): ScreenShot | undefined {
      return this.screenshots.find((screenshot, index) => index === id);
    },
    async fetchGamesByGenre(genreId: number, page: number = 1) {
      try {
        const { data } = await axios.get<{ results: Game[]; count: number }>(
          `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genreId}&page_size=24&page=${page}`
        );
        this.games = data.results;
        this.totalGames = data.count;
      } catch (error) {
        console.error("Failed to fetch games by genre:", error);
      }
    },
    async fetchTags() {
      try {
        const { data } = await axios.get<{ results: Tag[] }>(
          `https://api.rawg.io/api/tags?key=${API_KEY}`
        );
        this.tags = data.results;
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    },
    async fetchGamesByTag(tagId: number, page: number = 1) {
      try {
        const { data } = await axios.get<{ results: Game[]; count: number }>(
          `https://api.rawg.io/api/games?key=${API_KEY}&tags=${tagId}&page_size=24&page=${page}`
        );
        this.games = data.results;
        this.totalGames = data.count;
      } catch (error) {
        console.error("Failed to fetch games by tag:", error);
      }
    },
    async fetchStores() {
      try {
        const { data } = await axios.get<{ results: Store[] }>(
          `https://api.rawg.io/api/stores?key=${API_KEY}`
        );
        this.stores = data.results;
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    },
    async fetchGamesByStore(storeId: number, page: number = 1) {
      try {
        const { data } = await axios.get<{ results: Game[]; count: number }>(
          `https://api.rawg.io/api/games?key=${API_KEY}&stores=${storeId}&page_size=24&page=${page}`
        );
        this.games = data.results;
        this.totalGames = data.count;
      } catch (error) {
        console.error("Failed to fetch games by store:", error);
      }
    },
  },
});
