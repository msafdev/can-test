import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import GameList from "../GameList.vue";
import { useGamesStore } from "../../stores/game";
import router from "@/router";

vi.mock("@/router", () => ({
  default: {
    push: vi.fn(),
  },
}));

const mockGame = {
  id: 1,
  name: "Test Game",
  background_image: "test.jpg",
  metacritic: 85,
  platforms: [
    {
      platform: {
        id: 1,
        name: "PC",
        slug: "pc",
        image: null,
        year_end: null,
        year_start: null,
        games_count: 0,
        image_background: "",
      },
      released_at: "2023-01-01",
    },
  ],
  tags: [
    {
      id: 1,
      name: "Action",
      slug: "action",
      language: "eng",
      games_count: 0,
      image_background: "",
    },
  ],
  genres: [
    { id: 1, name: "RPG", slug: "rpg", games_count: 0, image_background: "" },
  ],
  stores: [
    {
      id: 1,
      store: {
        id: 1,
        name: "Steam",
        slug: "steam",
        domain: "store.steampowered.com",
        games_count: 0,
        image_background: "",
      },
    },
  ],
};

describe("GameList", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders correctly with games", async () => {
    const store = useGamesStore();
    store.games = [mockGame];
    store.totalGames = 1;

    const wrapper = mount(GameList);

    expect(wrapper.find("h1").text()).toBe("Popular Games");
    expect(wrapper.findComponent({ name: "GameCard" }).exists()).toBe(true);
  });

  it("renders search results when searchQuery is provided", async () => {
    const store = useGamesStore();
    store.games = [mockGame];

    const wrapper = mount(GameList, {
      props: {
        searchQuery: "Test",
      },
    });

    expect(wrapper.find("h1").text()).toBe('Search results for: "Test"');
  });

  it("displays pagination when there are multiple pages", async () => {
    const store = useGamesStore();
    store.games = Array(13).fill(mockGame);
    store.totalGames = 13;

    const wrapper = mount(GameList);

    expect(wrapper.find(".flex.items-center.justify-center").exists()).toBe(
      true
    );
    expect(wrapper.find("button:first-child").attributes("disabled")).toBe("");
    expect(wrapper.find("button:last-child").attributes("disabled")).toBe(
      undefined
    );
  });

  it("navigates to genre view when a genre is clicked", async () => {
    const store = useGamesStore();
    store.genres = [
      {
        id: 1,
        name: "Action",
        slug: "action",
        games_count: 100,
        image_background: "bg.jpg",
      },
    ];

    const wrapper = mount(GameList);

    await wrapper.find(".flex.flex-wrap.gap-2 div").trigger("click");

    expect(router.push).toHaveBeenCalledWith({
      name: "GenreView",
      params: { id: 1 },
    });
  });

  it("navigates to tag view when a tag is clicked", async () => {
    const store = useGamesStore();
    store.tags = [
      {
        id: 1,
        name: "Multiplayer",
        slug: "multiplayer",
        language: "eng",
        games_count: 100,
        image_background: "bg.jpg",
      },
    ];

    const wrapper = mount(GameList);

    await wrapper
      .findAll(".flex.flex-wrap.gap-2")[0]
      .find("div")
      .trigger("click");

    expect(router.push).toHaveBeenCalledWith({
      name: "TagView",
      params: { id: 1 },
    });
  });

  it("navigates to store view when a store is clicked", async () => {
    const store = useGamesStore();
    store.stores = [
      {
        id: 1,
        name: "Steam",
        slug: "steam",
        domain: "store.steampowered.com",
        games_count: 1000,
        image_background: "bg.jpg",
      },
    ];

    const wrapper = mount(GameList);

    await wrapper
      .findAll(".flex.flex-wrap.gap-2")[0]
      .find("div")
      .trigger("click");

    expect(router.push).toHaveBeenCalledWith({
      name: "StoreView",
      params: { id: 1 },
    });
  });

  it("fetches games on mount when no search query is provided", async () => {
    const store = useGamesStore();
    const fetchGamesSpy = vi.spyOn(store, "fetchGames");
    const fetchGenresSpy = vi.spyOn(store, "fetchGenres");
    const fetchTagsSpy = vi.spyOn(store, "fetchTags");
    const fetchStoresSpy = vi.spyOn(store, "fetchStores");

    mount(GameList);

    expect(fetchGamesSpy).toHaveBeenCalledWith(1);
    expect(fetchGenresSpy).toHaveBeenCalled();
    expect(fetchTagsSpy).toHaveBeenCalled();
    expect(fetchStoresSpy).toHaveBeenCalled();
  });

  it("searches games when search query is provided", async () => {
    const store = useGamesStore();
    const searchGamesSpy = vi.spyOn(store, "searchGames");

    mount(GameList, {
      props: {
        searchQuery: "Test",
      },
    });

    expect(searchGamesSpy).toHaveBeenCalledWith("Test", 1);
  });
});
