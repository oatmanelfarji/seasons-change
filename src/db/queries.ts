import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { holidays } from "./schema";

export const getHolidaysByCountry = createServerFn({
	method: "GET",
})
	.inputValidator((n: string) => n)
	.handler(async ({ data: countryCode }) => {
		return await db
			.select()
			.from(holidays)
			.where(eq(holidays.countryCode, countryCode))
			.orderBy(holidays.startDate);
	});
