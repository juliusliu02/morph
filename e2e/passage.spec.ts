import { expect, test } from "@playwright/test";
import {
  deleteTestUser,
  createTestUser,
  loginUser,
  testPassage,
  createTestEdit,
} from "@/e2e/utils";

test.describe("Create passage", async () => {
  test.beforeAll("create test user", async () => {
    await deleteTestUser();
    await createTestUser();
  });

  test.beforeEach("log in", async ({ page }) => {
    await loginUser(page);
  });

  test("passage form validation", async ({ page }) => {
    await page.goto("/app");
    await page.getByRole("button", { name: "Get grammar edit" }).click();
    await expect(page.getByText("Passage must be longer than")).toBeVisible();
  });

  test("user can get grammar edit", async ({ page }) => {
    test.slow();
    await page.getByRole("textbox", { name: "Title (optional)" }).click();
    await page
      .getByRole("textbox", { name: "Title (optional)" })
      .fill("Test passage");
    await page.getByRole("textbox", { name: "Body" }).click();
    await page.getByRole("textbox", { name: "Body" }).fill(testPassage);
    await page.getByRole("button", { name: "Get grammar edit" }).click();
    await page.waitForURL(/\/app\/passages\/.+/);
    await expect(
      page.getByRole("button", { name: "Get a new edit" }),
    ).toBeVisible();
  });

  test(`passage title default to "Untitled document"`, async ({ page }) => {
    test.slow();
    await page.getByRole("textbox", { name: "Body" }).click();
    await page.getByRole("textbox", { name: "Body" }).fill(testPassage);
    await page.getByRole("button", { name: "Get grammar edit" }).click();
    await page.waitForURL(/\/app\/passages\/.+/);
    await expect(
      page.getByRole("button", { name: "Get a new edit" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Untitled document",
    );
  });
});

test.describe("Passage list", async () => {
  test.beforeAll("create test user", async () => {
    await deleteTestUser();
    await createTestUser();
    await createTestEdit();
  });

  test.beforeEach("log in", async ({ page }) => {
    await loginUser(page);
  });

  test("user can get list of passages", async ({ page }) => {
    await page.goto("/app/passages");
    await expect(
      page.getByRole("link", { name: "Untitled document" }),
    ).toBeVisible();
  });

  test("user can delete a passage", async ({ page }) => {
    await page.goto("/app/passages");
    await page.getByLabel("Passage Action").click();
    await page.getByRole("menuitem", { name: "Delete passage" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
  });
});
