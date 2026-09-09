import { serializeCsvList } from './serialize-csv-list';

export const buildRoleAccessUpdateDto = (
  transactionCode: string,
  access: string[],
  process: string[]
) => ({
  transactionCode,
  access: serializeCsvList(access),
  process: serializeCsvList(process),
});
