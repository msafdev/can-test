import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import DarkMode from "@/components/DarkMode.vue";
import { Sun } from "lucide-vue-next";
import { useDark, useToggle } from "@vueuse/core";

vi.mock("@vueuse/core", () => {
  const isDark = { value: false };

  return {
    useDark: vi.fn(() => isDark),
    useToggle: vi.fn((ref) => () => {
      ref.value = !ref.value;
    }),
  };
});

describe("DarkMode", () => {
  it("toggles dark mode on button click", async () => {
    const wrapper = mount(DarkMode, {
      global: {
        stubs: {
          Sun: true,
        },
      },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);

    const isDark = wrapper.vm.isDark as unknown as { value: boolean };
    expect(isDark.value).toBe(false);

    await button.trigger("click");

    expect(isDark.value).toBe(true);
  });
});
