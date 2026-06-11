import { RequestHandler } from 'express';
import { NagerHoliday } from '../../../shared/nager/nagerType';
import { HolidayCache } from '../models/holiday.model';

export const getHolidays: RequestHandler = async (req, res, next) => {
  try {
    const { year, country } = req.query;
    if (!year || !country) return res.status(400).json({ message: 'Bad Request' });
    const yearNumber = Number(year);
    const countryStr = String(country);
    if (
      !Number.isInteger(yearNumber) ||
      yearNumber < 1900 ||
      yearNumber > new Date().getFullYear() + 1
    ) {
      return res.status(400).json({
        message: 'Bad Request: invalid year',
      });
    }

    const dataDB = await HolidayCache.findOne({ year: yearNumber, countryCode: countryStr });
    if (dataDB) return res.status(200).json({ data: dataDB.holidays });
    const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/${country}`);

    if (!response.ok) {
      return res.status(502).json({
        message: `Upstream error: ${response.status}`,
      });
    }
    const data: NagerHoliday[] = await response.json();
    const cleanedHolidays = data.map((holiday) => ({
      date: holiday.date,
      localName: holiday.localName,
      name: holiday.name,
      global: holiday.global,
      types: holiday.types,
      counties: holiday.counties || [],
    }));
    await HolidayCache.create({
      year: yearNumber,
      countryCode: countryStr,
      holidays: cleanedHolidays,
    });

    return res.status(200).json({ data: cleanedHolidays });
  } catch (error) {
    next(error);
  }
};
