import { object, number, date, string } from "joi";

export const create = object({
  cost: number().integer().required(),
  costCenterId: number().required(),
  payAt: date().required(),
  costElementId: number().required(),
  status: string()
    .valid("waiting", "paid", "cancelled")
    .default("waiting"),
  paymentMethodId: number().required(),
  content: string().allow("", null),
});

export const update = object({
  cost: number().integer(),
  costCenterId: number(),
  payAt: date(),
  costElementId: number(),
  status: string()
    .valid("waiting", "paid", "cancelled")
    .default("waiting"),
  paymentMethodId: number(),
  content: string().allow("", null),
});
