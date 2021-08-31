import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface PlaidAccount {
  access_token: string;
}
export const PlaidAccountSchema: Schema = new Schema(
  {
    access_token: {
      type: String,
    },
    employee_id: {
      type: ObjectId,
    },
  },
  { collection: 'PlaidAccounts' },
);

const PlaidAccountModel = model<PlaidAccount>('PlaidAccounts', PlaidAccountSchema);
export default PlaidAccountModel;
