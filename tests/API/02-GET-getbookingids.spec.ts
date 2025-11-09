import { test, expect } from "@playwright/test";

test.describe("GET /bookingids", () => {
  const base_url =
    process.env.BASE_URL || "https://restful-booker.herokuapp.com";

  test("should retrieve a list of booking IDs", async ({ request }) => {
    const response = await request.get(`${base_url}/booking`, {});
    const responseBody = JSON.parse(await response.text());
    expect(response.status()).toBe(200);
    console.log(`Response Status: ${response.status()}`);
    const bookingids = responseBody.map(
      (booking: { bookingid: number }) => booking.bookingid
    );
    console.log("Extracted Booking IDs:", bookingids);
  });
});
