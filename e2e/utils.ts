import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import type { Page } from "@playwright/test";

export const exampleUser = {
  name: "John Doe",
  username: "jd",
  email: "johndoe@example.com",
  password: "abcStrong123",
  hashedPassword: await bcrypt.hash("abcStrong123", 10),
};

export const createExampleUser = async () => {
  await prisma.user.create({
    data: {
      name: exampleUser.name,
      email: exampleUser.email,
      username: exampleUser.username,
      hashedPassword: exampleUser.hashedPassword,
    },
  });
};

export const clearUser = async () => {
  await prisma.user.deleteMany({});
};

export const loginUser = async (page: Page) => {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "Username" }).click();
  await page
    .getByRole("textbox", { name: "Username" })
    .fill(exampleUser.username);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(exampleUser.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("/app");
};
