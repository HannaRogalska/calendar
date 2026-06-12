import { Schema, model } from 'mongoose';

const HolidayCacheSchema = new Schema({
  year: { type: Number, required: true },
  countryCode: { type: String, required: true },
  holidays: [
    {
      date: { type: String, required: true },
      localName: { type: String, required: true },
      name: { type: String, required: true },
      counties: { type: [String] },
      global: { type: Boolean },
      types: { type: [String] },
    }
  ],
});
HolidayCacheSchema.index({ year: 1, countryCode: 1 }, { unique: true });

export const HolidayCache = model('HolidayCache', HolidayCacheSchema);
