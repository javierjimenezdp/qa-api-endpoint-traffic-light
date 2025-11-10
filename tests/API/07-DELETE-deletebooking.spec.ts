import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";


test.describe.serial("DELETE Booking Testing", () => {
    const base_url = process.env.BASE_URL || "https://restful-booker.herokuapp.com";
    const toISODate = (d: Date) => d.toISOString().slice(0, 10);
    let token: string
    let bookingId: number
    let originalBookingData: any

    // Initial setup - create token once for all sub-tests
    test.beforeAll("Setup: Create authentication token", async ({ request }) => {
        const response = await request.post(`${base_url}/auth`, {
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        const responseBodytoken = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        token = responseBodytoken.token;
        console.log(`✅ Token created: ${token}`);
    });

    // Create base booking once for all sub-tests
    test.beforeAll("Setup: Create base booking for testing", async ({ request }) => {
        const checkin = faker.date.soon(10);
        const checkout = new Date(checkin);
        checkout.setDate(checkin.getDate() + faker.datatype.number({ min: 1, max: 14 }));

        const response = await request.post(`${base_url}/booking`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            data: {
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                totalprice: faker.datatype.number({ min: 50, max: 500 }),
                depositpaid: faker.datatype.boolean(),
                bookingdates: {
                    checkin: toISODate(checkin),
                    checkout: toISODate(checkout),
                },
                additionalneeds: faker.lorem.words(3),
            },
        });
        
        const responseBodycreate = JSON.parse(await response.text());
        bookingId = responseBodycreate.bookingid;
        originalBookingData = responseBodycreate.booking;
        expect(response.status()).toBe(200);
        console.log(`✅ Base booking created with ID: ${bookingId}`);
        console.log("Original booking data:", originalBookingData);
    });

    test("should delete the created booking", async ({ request }) => {
        console.log(`\n=== DELETING BOOKING ID: ${bookingId} ===`);
        
        const response = await request.delete(`${base_url}/booking/${bookingId}`, {
            headers: {
                "Cookie": `token=${token}`,
                "Authorization": `Bearer ${token}`,
            },
        });
        
        expect(response.status()).toBe(201);
        console.log(`✅ Booking deleted successfully. Response Status: ${response.status()}`);
        
        const verificationResponse = await request.get(`${base_url}/booking/${bookingId}`);
        expect(verificationResponse.status()).toBe(404); 
        console.log(`✅ Verified booking deletion. GET request returned 404 as expected`);
    });
});