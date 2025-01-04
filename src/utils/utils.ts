import {
  getDisplayAmountOnCurrency,
  TCurrencyData,
} from 'country-currency-utils';
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

export const convertToKilo = (value: number): string | number => {
  const result = value / 1000;
  if (result >= 1) {
    return `${result}K`;
  } else {
    return value;
  }
};

export const convertKiloToNumber = (number: string | number): number => {
  const _number = number.toString().toLowerCase();

  if (_number.includes('k')) {
    const numericPart = parseFloat(_number.replace('k', ''));
    return numericPart * 1000;
  }

  return Number(_number);
};

export const getCurrencyAmount = (value: number, currency: TCurrencyData) => {
  const amount = getDisplayAmountOnCurrency(value, currency, {
    isSymbolStandard: true,
    avoidFixedDecimals: true,
    avoidRound: true,
  });

  return amount;
};
