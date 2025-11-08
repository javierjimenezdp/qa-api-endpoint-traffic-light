import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("POST /createbooking", () => {
    const base_url = process.env.BASE_URL || "https://restful-booker.herokuapp.com/";
    const toISODate = (d: Date) => d.toISOString().slice(0, 10);

    test("should create a new booking", async ({ request }) => {
        const checkin = faker.date.soon(10);
        const checkout = new Date(checkin);
        checkout.setDate(checkin.getDate() + faker.datatype.number({ min: 1, max: 14 }));

        const response = await request.post(`${base_url}booking`, {
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
                    checkin: toISODate( checkin),
                    checkout: toISODate( checkout),
                },
                additionalneeds: faker.lorem.words(3),
            },
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        console.log(`Response Status: ${response.status()}`);
        console.log("Created Booking Response:", responseBody);
    });

});