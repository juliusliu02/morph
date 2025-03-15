import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { expect, Page } from "@playwright/test";
import { LandingEdits } from "@/public/data";

// test data
export const testUser = {
  id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  username: "jd",
  email: "johndoe@example.com",
  password: "abcStrong123",
  hashedPassword: await bcrypt.hash("abcStrong123", 10),
};

export const testPassage = LandingEdits[0].text;

export const testGrammarEdit = LandingEdits[1].text;

// DB utils
export const createTestUser = async () => {
  await prisma.user.create({
    data: {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
      username: testUser.username,
      hashedPassword: testUser.hashedPassword,
    },
  });
};

export const deleteTestUser = async () => {
  await prisma.user.deleteMany({
    where: {
      username: testUser.username,
    },
  });
};

export const createTestEdit = async () => {
  await prisma.dialogue.create({
    data: {
      title: "",
      ownerId: testUser.id,
      versions: {
        create: [
          {
            edit: "ORIGINAL",
            text: testPassage,
          },
          {
            edit: "GRAMMAR",
            text: testGrammarEdit,
          },
        ],
      },
    },
  });
};

// Page utils
export const loginUser = async (page: Page) => {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill(testUser.username);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(testUser.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("/app");
};

export const getTestEdit = async (page: Page) => {
  await page.getByRole("textbox", { name: "Body" }).click();
  await page.getByRole("textbox", { name: "Body" }).fill(testPassage);
  await page.getByRole("button", { name: "Get grammar edit" }).click();
  await page.waitForURL(/\/app\/passages\/.+/);
  await expect(
    page.getByRole("button", { name: "Get a new edit" }),
  ).toBeVisible();
};
