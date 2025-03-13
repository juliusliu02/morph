import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import type { Page } from "@playwright/test";

export const testUser = {
  name: "John Doe",
  username: "jd",
  email: "johndoe@example.com",
  password: "abcStrong123",
  hashedPassword: await bcrypt.hash("abcStrong123", 10),
};

export const createTestUser = async () => {
  await prisma.user.create({
    data: {
      name: testUser.name,
      email: testUser.email,
      username: testUser.username,
      hashedPassword: testUser.hashedPassword,
    },
  });
};

export const deleteTestUser = async () => {
  await prisma.user.delete({
    where: {
      username: testUser.username,
    },
  });
};

export const loginUser = async (page: Page) => {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill(testUser.username);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(testUser.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("/app");
};
