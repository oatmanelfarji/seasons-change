import { getAstronomicalCalendar, getHouseForDate } from "./src/lib/astronomical-utils.ts";
import { format } from "date-fns";

const leapYear = 2028;
const standardYear = 2027;

try {
    console.log(`--- Validation: Leap Year ${leapYear} ---`);
    const leapCalendar = getAstronomicalCalendar(leapYear);
    const house7Leap = leapCalendar.find(h => h.id === 7);
    if (house7Leap) {
        console.log(`House 7 (Leap): ${house7Leap.englishName}`);
        console.log(`Dates: ${format(house7Leap.calculatedStartDate, 'yyyy-MM-dd')} to ${format(house7Leap.calculatedEndDate, 'yyyy-MM-dd')}`);
        console.log(`Duration: ${house7Leap.duration} days`);
    }

    console.log(`\n--- Validation: Standard Year ${standardYear} ---`);
    const standardCalendar = getAstronomicalCalendar(standardYear);
    const house7Standard = standardCalendar.find(h => h.id === 7);
    if (house7Standard) {
        console.log(`House 7 (Standard): ${house7Standard.englishName}`);
        console.log(`Dates: ${format(house7Standard.calculatedStartDate, 'yyyy-MM-dd')} to ${format(house7Standard.calculatedEndDate, 'yyyy-MM-dd')}`);
        console.log(`Duration: ${house7Standard.duration} days`);
    }

    console.log("\n--- Specific Leap Day Check (2028-02-29) ---");
    const leapDay = new Date(2028, 1, 29);
    const houseOnLeapDay = getHouseForDate(leapDay);
    console.log(`Date: 2028-02-29 falls in: ${houseOnLeapDay?.englishName} (House ${houseOnLeapDay?.id})`);
} catch (e) {
    console.error("Test failed:", e);
}
