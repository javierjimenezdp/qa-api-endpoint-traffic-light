import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe.serial("PUT total update", () => {
const base_url = process.env.BASE_URL || "https://restful-booker.herokuapp.com";
const toISODate = (d: Date) => d.toISOString().slice(0, 10);
let token: string
let bookingId: number
let originalBookingData: any
let updatedBookingData: any  


test.beforeAll("should create a new token with valid credentials", async ({request,}) => {
    const response = await request.post(`${base_url}/auth`, {
        headers: 
            {
                "Content-Type": "application/json",
            },
        data: 
            {
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            },
        });
    const responseBodytoken = JSON.parse(await response.text());
    expect(response.status()).toBe(200);
    console.log(`Response Status: ${response.status()}`);
    expect(responseBodytoken).toHaveProperty("token");
    token = responseBodytoken.token;
    console.log(`Generated Token: ${token}`);
});

    test("should create a new booking", async ({ request }) => {
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
                    checkin: toISODate( checkin),
                    checkout: toISODate( checkout),
                },
                additionalneeds: faker.lorem.words(3),
            },
        });
        const responseBodycreate = JSON.parse(await response.text());
        bookingId = responseBodycreate.bookingid;
        originalBookingData = responseBodycreate.booking; 
        expect(response.status()).toBe(200);
        console.log(`Response Status: ${response.status()}`);
        console.log("Created Booking Response:", responseBodycreate);
    });

    test("should update the booking", async ({ request }) => {
        const updateCheckin = faker.date.soon(10);
        const updateCheckout = new Date(updateCheckin);
        updateCheckout.setDate(updateCheckin.getDate() + faker.datatype.number({ min: 1, max: 14 }));

        const response = await request.put(`${base_url}/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            data: {
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                totalprice: faker.datatype.number({ min: 50, max: 500 }),
                depositpaid: faker.datatype.boolean(),
                bookingdates: {
                    checkin: toISODate(updateCheckin),
                    checkout: toISODate(updateCheckout),
                },
                additionalneeds: faker.lorem.words(3),
            },
        });
        
        const responseBodyupdate = JSON.parse(await response.text());
        updatedBookingData = responseBodyupdate; 
        expect(response.status()).toBe(200);
        console.log(`Response Status: ${response.status()}`);
        console.log("Updated Booking Response:", responseBodyupdate);
    });

    test("should validate that booking data changed after update", async () => {
        const validations = [
            originalBookingData.firstname !== updatedBookingData.firstname,
            originalBookingData.lastname !== updatedBookingData.lastname,
            originalBookingData.totalprice !== updatedBookingData.totalprice,
            originalBookingData.depositpaid == updatedBookingData.depositpaid,
            originalBookingData.additionalneeds !== updatedBookingData.additionalneeds,
            originalBookingData.bookingdates.checkin !== updatedBookingData.bookingdates.checkin,
            originalBookingData.bookingdates.checkout !== updatedBookingData.bookingdates.checkout
        ];
        const allFieldsChanged = validations.every(validation => validation === true);
        
        if (allFieldsChanged) {
            console.log("✅ All booking fields have been successfully updated and are different from original values");
        } else {
            console.log("❌ Debes validar: algunos campos no cambiaron correctamente");
            console.log("Detalles de validación:");
            console.log(`- firstname changed: ${validations[0]}`);
            console.log(`- lastname changed: ${validations[1]}`);
            console.log(`- totalprice changed: ${validations[2]}`);
            console.log(`- depositpaid changed: ${validations[3]}`);
            console.log(`- additionalneeds changed: ${validations[4]}`);
            console.log(`- checkin changed: ${validations[5]}`);
            console.log(`- checkout changed: ${validations[6]}`);
        }
        expect(allFieldsChanged).toBe(true);
    });

});