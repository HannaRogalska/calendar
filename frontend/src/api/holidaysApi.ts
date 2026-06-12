import axios from 'axios';


export const getHolidays = async (country: string, year: number) => {
  try {
    const response = await axios.get(`/api/holidays/PublicHolidays`, {
      params: { year, country },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
