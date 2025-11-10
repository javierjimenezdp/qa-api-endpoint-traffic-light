import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

// MAIN TEST SUITE - PATCH Partial Update Suite
test.describe.serial("PATCH Partial Update - Individual Field Testing", () => {
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

    // SUB-TEST 1: FIRSTNAME
    test("PATCH Update - firstname field only", async ({ request }) => {
        console.log("\n=== Testing FIRSTNAME field update ===");
        
        const newFirstname = faker.name.firstName();
        console.log(`Updating firstname from '${originalBookingData.firstname}' to '${newFirstname}'`);

        const response = await request.patch(`${base_url}/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            data: {
                firstname: newFirstname,
            },
        });
        
        const updatedBookingData = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        
        // Specific validations for firstname
        expect(updatedBookingData.firstname).toBe(newFirstname);
        expect(updatedBookingData.firstname).not.toBe(originalBookingData.firstname);
        
        // Validate that other fields did NOT change
        expect(updatedBookingData.lastname).toBe(originalBookingData.lastname);
        expect(updatedBookingData.totalprice).toBe(originalBookingData.totalprice);
        expect(updatedBookingData.depositpaid).toBe(originalBookingData.depositpaid);
        
        console.log("✅ Firstname updated successfully and other fields remained unchanged");
    });

    // SUB-TEST 2: LASTNAME
    test("PATCH Update - lastname field only", async ({ request }) => {
        console.log("\n=== Testing LASTNAME field update ===");
        
        const newLastname = faker.name.lastName();
        console.log(`Updating lastname from '${originalBookingData.lastname}' to '${newLastname}'`);

        const response = await request.patch(`${base_url}/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            data: {
                lastname: newLastname,
            },
        });
        
        const updatedBookingData = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        
        // Specific validations for lastname
        expect(updatedBookingData.lastname).toBe(newLastname);
        expect(updatedBookingData.lastname).not.toBe(originalBookingData.lastname);
        
        // Validate that other fields did NOT change (except firstname which changed in previous test)
        expect(updatedBookingData.totalprice).toBe(originalBookingData.totalprice);
        expect(updatedBookingData.depositpaid).toBe(originalBookingData.depositpaid);
        
        console.log("✅ Lastname updated successfully and other fields remained unchanged");
    });

    // SUB-TEST 3: TOTALPRICE
    test("PATCH Update - totalprice field only", async ({ request }) => {
        console.log("\n=== Testing TOTALPRICE field update ===");
        
        const newTotalPrice = faker.datatype.number({ min: 100, max: 1000 });
        console.log(`Updating totalprice from '${originalBookingData.totalprice}' to '${newTotalPrice}'`);

        const response = await request.patch(`${base_url}/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            data: {
                totalprice: newTotalPrice,
            },
        });
        
        const updatedBookingData = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        
        // Specific validations for totalprice
        expect(updatedBookingData.totalprice).toBe(newTotalPrice);
        expect(updatedBookingData.totalprice).not.toBe(originalBookingData.totalprice);
        
        console.log("✅ Totalprice updated successfully");
    });

    // SUB-TEST 4: DEPOSITPAID
    test("PATCH Update - depositpaid field only", async ({ request }) => {
        console.log("\n=== Testing DEPOSITPAID field update ===");
        
        const newDepositPaid = !originalBookingData.depositpaid; // Invert the original value
        console.log(`Updating depositpaid from '${originalBookingData.depositpaid}' to '${newDepositPaid}'`);

        const response = await request.patch(`${base_url}/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            data: {
                depositpaid: newDepositPaid,
            },
        });
        
        const updatedBookingData = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        
        // Specific validations for depositpaid
        expect(updatedBookingData.depositpaid).toBe(newDepositPaid);
        expect(updatedBookingData.depositpaid).not.toBe(originalBookingData.depositpaid);
        
        console.log("✅ Depositpaid updated successfully");
    });

    // SUB-TEST 5: ADDITIONALNEEDS
    test("PATCH Update - additionalneeds field only", async ({ request }) => {
        console.log("\n=== Testing ADDITIONALNEEDS field update ===");
        
        const newAdditionalNeeds = faker.lorem.words(5);
        console.log(`Updating additionalneeds from '${originalBookingData.additionalneeds}' to '${newAdditionalNeeds}'`);

        const response = await request.patch(`${base_url}/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            data: {
                additionalneeds: newAdditionalNeeds,
            },
        });
        
        const updatedBookingData = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        
        // Specific validations for additionalneeds
        expect(updatedBookingData.additionalneeds).toBe(newAdditionalNeeds);
        expect(updatedBookingData.additionalneeds).not.toBe(originalBookingData.additionalneeds);
        
        console.log("✅ Additionalneeds updated successfully");
    });

    // SUB-TEST 6: CHECKIN DATE
    test("PATCH Update - bookingdates.checkin field only", async ({ request }) => {
        console.log("\n=== Testing CHECKIN DATE field update ===");
        
        const newCheckin = faker.date.soon(5);
        const newCheckinFormatted = toISODate(newCheckin);
        console.log(`Updating checkin from '${originalBookingData.bookingdates.checkin}' to '${newCheckinFormatted}'`);

        const response = await request.patch(`${base_url}/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            data: {
                bookingdates: {
                    checkin: newCheckinFormatted,
                    checkout: originalBookingData.bookingdates.checkout // Keep original checkout
                }
            },
        });
        
        const updatedBookingData = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        
        // Specific validations for checkin
        expect(updatedBookingData.bookingdates.checkin).toBe(newCheckinFormatted);
        expect(updatedBookingData.bookingdates.checkin).not.toBe(originalBookingData.bookingdates.checkin);
        
        // Validate that checkout did NOT change
        expect(updatedBookingData.bookingdates.checkout).toBe(originalBookingData.bookingdates.checkout);
        
        console.log("✅ Checkin date updated successfully and checkout remained unchanged");
    });

    // SUB-TEST 7: CHECKOUT DATE
    test("PATCH Update - bookingdates.checkout field only", async ({ request }) => {
        console.log("\n=== Testing CHECKOUT DATE field update ===");
        
        const newCheckout = faker.date.soon(20);
        const newCheckoutFormatted = toISODate(newCheckout);
        console.log(`Updating checkout from '${originalBookingData.bookingdates.checkout}' to '${newCheckoutFormatted}'`);

        const response = await request.patch(`${base_url}/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            data: {
                bookingdates: {
                    checkin: originalBookingData.bookingdates.checkin, // Keep original checkin
                    checkout: newCheckoutFormatted
                }
            },
        });
        
        const updatedBookingData = JSON.parse(await response.text());
        expect(response.status()).toBe(200);
        
        // Specific validations for checkout
        expect(updatedBookingData.bookingdates.checkout).toBe(newCheckoutFormatted);
        expect(updatedBookingData.bookingdates.checkout).not.toBe(originalBookingData.bookingdates.checkout);
        
        // Validate that checkin did NOT change (we keep original value, not from previous test)
        expect(updatedBookingData.bookingdates.checkin).toBe(originalBookingData.bookingdates.checkin);
        
        console.log("✅ Checkout date updated successfully and checkin remained unchanged");
    });

});
