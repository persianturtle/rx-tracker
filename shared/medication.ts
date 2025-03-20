import type { Schedule, Recurrence } from "./types.ts";

export function getMedicationSchedule({
  schedule,
}: {
  schedule: Schedule;
}): Array<Date> {
  switch (schedule.recurrence.type) {
    case "every-n-days":
      return getEveryNDaysSchedule({
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        recurrence: schedule.recurrence,
      });
    case "every-nth-day-of-month":
      return getEveryNthDayOfMonthSchedule({
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        recurrence: schedule.recurrence,
      });
  }
}

function getEveryNDaysSchedule({
  startDate,
  endDate,
  recurrence,
}: {
  startDate: Schedule["startDate"];
  endDate: Schedule["endDate"];
  recurrence: Extract<Recurrence, { type: "every-n-days" }>;
}): Array<Date> {
  const { time, n } = recurrence;
  const dates: Array<Date> = [];
  let currentDate = new Date(`${startDate} ${time}`);
  let currentEndDate = new Date(`${startDate} ${time}`);
  currentEndDate.setDate(currentEndDate.getDate() + 21);

  const [hours, minutes] = time.split(":").map(Number);

  if (
    endDate &&
    new Date(`${endDate} ${time}`).getTime() < currentEndDate.getTime()
  ) {
    currentEndDate = new Date(`${endDate} ${time}`);
  }

  while (currentDate <= currentEndDate) {
    dates.push(currentDate);
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + n,
      hours,
      minutes
    );
  }

  return dates;
}

function getEveryNthDayOfMonthSchedule({
  startDate,
  endDate,
  recurrence,
}: {
  startDate: Schedule["startDate"];
  endDate: Schedule["endDate"];
  recurrence: Extract<Recurrence, { type: "every-nth-day-of-month" }>;
}): Array<Date> {
  const { time, dayOfMonth } = recurrence;
  const dates: Array<Date> = [];
  let currentDate = new Date(`${startDate} ${time}`);
  let currentEndDate = new Date(`${startDate} ${time}`);
  currentEndDate.setDate(currentEndDate.getDate() + 100);

  const [hours, minutes] = time.split(":").map(Number);

  if (
    endDate &&
    new Date(`${endDate} ${time}`).getTime() < currentEndDate.getTime()
  ) {
    currentEndDate = new Date(`${endDate} ${time}`);
  }

  while (currentDate <= currentEndDate) {
    if (currentDate.getDate() === dayOfMonth) {
      dates.push(currentDate);
    }
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      dayOfMonth,
      hours,
      minutes
    );
  }

  return dates;
}
