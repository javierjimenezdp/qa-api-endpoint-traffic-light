import { test, expect } from "@playwright/test";

test.describe("POST /createtoken", () => {
  const base_url =
    process.env.BASE_URL || "https://restful-booker.herokuapp.com";

  test("should create a new token with valid credentials", async ({request,}) => {
    console.log("user:", process.env.ADMIN_USERNAME);
    console.log("pass:", process.env.ADMIN_PASSWORD);
    
    const response = await request.post(`${base_url}/auth`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      },
    });
    const responseBody = JSON.parse(await response.text());
    expect(response.status()).toBe(200);
    console.log(`Response Status: ${response.status()}`);
    expect(responseBody).toHaveProperty("token");
    const token = responseBody.token;
    console.log(`Generated Token: ${token}`);
  });
});
