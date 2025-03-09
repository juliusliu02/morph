import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.*Morph.*/);
  });

  test("log in page can be opened", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "log in" }).click();
    await expect(page).toHaveURL("/login");
  });

  test("sign up page can be opened", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "sign up" }).click();
    await expect(page).toHaveURL("/signup");
  });

  test("get started button can be opened", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "start for free" }).click();
    await expect(page).toHaveURL("/signup");
  });
});
