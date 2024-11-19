import dayjs from 'dayjs';

export const getGreeting = (): string => {
  const currentHour = dayjs().hour();

  if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};
