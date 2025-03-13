import { expect, test } from "@playwright/test";
import {
  deleteTestUser,
  createTestUser,
  testUser,
  loginUser,
} from "@/e2e/utils";

test.describe("Input validation", () => {
  test("log in page has input validation", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "log in" }).click();
    await expect(page.getByText("Username cannot be empty")).toBeVisible();
    await expect(page.getByText("Password must be longer than")).toBeVisible();
  });

  test("sign up page has input validation", async ({ page }) => {
    await page.goto("/signup");
    await page.getByRole("button", { name: "sign up" }).click();
    await expect(page.getByText("Username must be longer than")).toBeVisible();
    await expect(page.getByText("Name cannot be empty")).toBeVisible();
    await expect(page.getByText("Please enter a valid email")).toBeVisible();
    await expect(page.getByText("Password must be longer than")).toBeVisible();
  });
});

test.describe("Unauthenticated", () => {
  test.beforeEach(async () => {
    await deleteTestUser();
  });

  test("user can sign up", async ({ page }) => {
    await page.goto("/signup");
    await page.getByRole("textbox", { name: "Username" }).click();
    await page
      .getByRole("textbox", { name: "Username" })
      .fill(testUser.username);
    await page.getByRole("textbox", { name: "Full Name" }).click();
    await page.getByRole("textbox", { name: "Full Name" }).fill(testUser.name);
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(testUser.email);
    await page.getByRole("textbox", { name: "Password" }).click();
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(testUser.password);
    await page.getByRole("button", { name: "Sign up" }).click();
    await page.waitForURL("/app");
    await expect(
      page.getByRole("heading", { name: `Hello ${testUser.name}.` }),
    ).toBeVisible();
  });
});

test.describe("Authentication", async () => {
  test.beforeAll("set up example user", async () => {
    await deleteTestUser();
    await createTestUser();
  });

  test("unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/app");
    await expect(page).toHaveURL("/login");
  });

  test("user can log in", async ({ page }) => {
    await loginUser(page);
    await expect(
      page.getByRole("heading", { name: `Hello ${testUser.name}.` }),
    ).toBeVisible();
  });
});

test.describe("Authenticated", async () => {
  test.beforeAll("set up example user", async () => {
    await deleteTestUser();
    await createTestUser();
  });

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test("user can log out", async ({ page }) => {
    await page.goto("/app");
    await page.getByText("Log out").click();
    await page.waitForURL("/login");
    await page.goto("/app");
    await expect(page).toHaveURL("/login");
  });

  test("authenticated user is redirected to app page", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/app");
  });
});
