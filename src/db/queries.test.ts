import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getWeather } from "./queries";

describe("getWeather server function", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("should fetch weather data successfully", async () => {
		const mockData = { data: { values: { temperature: 20 } } };
		(fetch as any).mockResolvedValue({
			ok: true,
			json: async () => mockData,
		});

		const result = await getWeather({ data: "London" });
		expect(result).toEqual(mockData);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should retry on failure and eventually succeed", async () => {
		const mockData = { data: { values: { temperature: 20 } } };
		(fetch as any)
			.mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: async () => ({ message: "Server Error" }),
			})
			.mockResolvedValueOnce({ ok: true, json: async () => mockData });

		const result = await getWeather({ data: "London" });
		expect(result).toEqual(mockData);
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	it("should throw an error after max retries", async () => {
		(fetch as any).mockResolvedValue({
			ok: false,
			status: 500,
			json: async () => ({ message: "Persistent Error" }),
		});

		await expect(getWeather({ data: "London" })).rejects.toThrow(
			/Weather API failed after 3 attempts/,
		);
		expect(fetch).toHaveBeenCalledTimes(3);
	});

	it("should throw an error if location is missing", async () => {
		await expect(getWeather({ data: "" })).rejects.toThrow(
			"Location is required",
		);
	});
});
