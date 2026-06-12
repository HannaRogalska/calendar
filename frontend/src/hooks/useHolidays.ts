import { useQuery} from "@tanstack/react-query";
import { getHolidays } from "../api/holidaysApi";


export const useHolidays = (country: string, year: number, selectedMonth: number) => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['holidays', country, year],
    queryFn: () => getHolidays(country, year),
    select: (allHolidays) => {
      return allHolidays.filter((holiday: any) => {
        const holidayDate = new Date(holiday.date);
        return holidayDate.getMonth() === selectedMonth;
      })
    },
  });
  return {
    data,
    isLoading,
    isError,
  };
};


