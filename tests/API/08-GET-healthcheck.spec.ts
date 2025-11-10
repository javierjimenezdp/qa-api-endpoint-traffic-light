import { test, expect } from "@playwright/test";

test.describe("GET Healthcheck Testing", () => {
    const base_url = process.env.BASE_URL || "https://restful-booker.herokuapp.com";
    test("should return 201 OK for healthcheck endpoint", async ({ request }) => {
        const response = await request.get(`${base_url}/ping`);
        expect(response.status()).toBe(201);
        console.log(`✅ Healthcheck passed. Response Status: ${response.status()}`);
    });
});