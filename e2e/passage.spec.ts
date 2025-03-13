import { expect, test } from "@playwright/test";
import { deleteTestUser, createTestUser, loginUser } from "@/e2e/utils";

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
    await page
      .getByRole("textbox", { name: "Body" })
      .fill(
        "The research of artificial intelligence have been increased significantly in the last years, leading to many new discoveries. Scientist are trying to develop more advanced algorithms which can process datas more efficiently. However, there is still many challenges, including the ethic concerns and the lack of clear regulations. On the other hand, some experts argues that AI will replace humans in many profession, while others believe it will rather support peoples in their work. In conclusion, AI is an important topic that requires a careful considerations.",
      );
    await page.getByRole("button", { name: "Get grammar edit" }).click();
    await page.waitForURL(/\/app\/passages\/.+/);
    await expect(
      page.getByRole("button", { name: "Get a new edit" }),
    ).toBeVisible();
  });
});
