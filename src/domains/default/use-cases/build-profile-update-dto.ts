export interface BuildProfileUpdateDtoInput {
  userCode: string;
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  website1: string;
  website2: string;
  address1: string;
  address2: string;
  otherContact: string;
}

export const buildProfileUpdateDto = ({
  userCode,
  email1,
  email2,
  phone1,
  phone2,
  website1,
  website2,
  address1,
  address2,
  otherContact,
}: BuildProfileUpdateDtoInput) => ({
  userCode,
  email1,
  email2,
  phone1,
  phone2,
  website1,
  website2,
  address1,
  address2,
  otherContact,
});
