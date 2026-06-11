import { RequestHandler } from 'express';
import { NagerHoliday } from '../../../shared/nager/nagerType';
import { HolidayCache } from '../models/holiday.model';

export const getHolidays: RequestHandler = async (req, res, next) => {
  try {
    const { year, country } = req.query;
    if (!year || !country) return res.status(400).json({ message: 'Bad Request' });
    const yearNumber = Number(year);
    const countryStr = String(country);

    const dataDB = await HolidayCache.findOne({ year: yearNumber, countryCode: countryStr });
    if (dataDB) return res.status(200).json({ data: dataDB.holidays });
      const response = await fetch(
        `https://date.nager.at/api/v3/publicholidays/${year}/${country}`
      );

    if (!response.ok) return res.status(404).json({ message: `${response.status}` });
    const data: NagerHoliday[] = await response.json();
    await HolidayCache.create({ year: yearNumber, countryCode: countryStr, holidays: data });

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
