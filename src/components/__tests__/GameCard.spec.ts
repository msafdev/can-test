import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GameCard from "@/components/GameCard.vue";

describe("GameCard.vue", () => {
  it("renders game information correctly", () => {
    const game = {
      id: 1,
      name: "Test Game",
      background_image: "test.jpg",
      metacritic: 85,
      platforms: [],
      tags: [],
      genres: [],
      stores: [],
    };

    const wrapper = mount(GameCard, {
      props: { game },
    });

    expect(wrapper.text()).toContain("Test Game");
    expect(wrapper.find("img").attributes("src")).toBe("test.jpg");
  });
});
