import { test, expect } from "@playwright/test";

test.describe("Get Booking ID", () => {
  const base_url =
    process.env.BASE_URL || "https://restful-booker.herokuapp.com";
  let ramdomBookingId: number | null = null;

  test.beforeAll(
    "should retrieve a list of booking IDs",
    async ({ request }) => {
      const response = await request.get(`${base_url}/booking`, {});
      const responseBody = JSON.parse(await response.text());
      ramdomBookingId =
        responseBody.length > 0
          ? responseBody[Math.floor(Math.random() * responseBody.length)]
              .bookingid
          : null;
      console.log(`Response Status: ${response.status()}`);
      console.log("Randomly Selected Booking ID:", ramdomBookingId);
    }
  );

  test("Returns a specific booking by ID", async ({ request }) => {
    const response = await request.get(
      `${base_url}/booking/${ramdomBookingId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const responseBody = JSON.parse(await response.text());
    expect(response.status()).toBe(200);
    expect(responseBody).toHaveProperty("firstname");
    expect(responseBody).toHaveProperty("lastname");
    expect(responseBody).toHaveProperty("totalprice");
    expect(responseBody).toHaveProperty("depositpaid");
    expect(responseBody).toHaveProperty("bookingdates");
    expect(responseBody.bookingdates).toHaveProperty("checkin");
    expect(responseBody.bookingdates).toHaveProperty("checkout");
    expect(responseBody).toHaveProperty("additionalneeds");
    console.log(`Response Status: ${response.status()}`);
    console.log("Booking Details:", responseBody);
  });
});
