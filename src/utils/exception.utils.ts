import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DATA_REFERENCE, ERROR_CODES } from '@/constants/error-codes.constant';
import { constants } from 'http2';

export const throwDataReferenceException = () => {
  throw new BadRequestException({
    code: DATA_REFERENCE,
    message: ERROR_CODES.get(DATA_REFERENCE),
  });
};

export const throwBadRequest = (code) => {
  throw new BadRequestException({
    code: code,
    message: ERROR_CODES.get(code),
  });
};

export const throwNotFound = (code) => {
  throw new NotFoundException({
    code: code,
    message: ERROR_CODES.get(code),
  });
};
