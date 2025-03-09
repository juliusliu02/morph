import { expect, test } from "@playwright/test";

test.describe("Input validation", () => {
  test("log in page has input validation", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "log in" }).click();
    await expect(page.getByText("Username cannot be empty")).toBeVisible();
    await expect(page.getByText("Password must be longer than")).toBeVisible();
  });

  test("l\sign up page has input validation", async ({ page }) => {
    await page.goto("/signup");
    await page.getByRole("button", { name: "sign up" }).click();
    await expect(page.getByText("Username must be longer than")).toBeVisible();
    await expect(page.getByText("Name cannot be empty")).toBeVisible();
    await expect(page.getByText("Please enter a valid email")).toBeVisible();
    await expect(page.getByText("Password must be longer than")).toBeVisible();
  });
});

test.describe("Authentication", () => {
  test("unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/app");
    await expect(page).toHaveURL("/login");
  });
});
