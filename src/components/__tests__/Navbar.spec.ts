import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Navbar from "@/components/Navbar.vue";
import { createRouter, createWebHistory } from "vue-router";
import router from "@/router/index";

const routers = createRouter({
  history: createWebHistory(),
  routes: router.options.routes,
});

describe("Navbar", () => {
  it("emits search event and navigates to home on search", async () => {
    const emit = vi.fn();

    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          DarkMode: true,
        },
      },
      props: {
        emit,
      },
    });

    const input = wrapper.find('input[type="text"]');
    await input.setValue("test query");

    await input.trigger("keydown.enter");

    expect(wrapper.emitted()).toHaveProperty("search");
    expect(wrapper.emitted("search")![0]).toEqual(["test query"]);

    expect(router.currentRoute.value.fullPath).toBe("/");
  });
});
