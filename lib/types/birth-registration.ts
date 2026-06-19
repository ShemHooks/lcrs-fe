import { AddressValue } from "@/components/reusable/AddressSelector";

export interface BirthRegistrationData {
  address: AddressValue;

  childFirstName: string;
  childMiddleName: string;
  childLastName: string;

  gender: string;
  birthDate: string;

  placeOfBirth: AddressValue;
  hospitalName: string;

  typeOfBirth: string;
  multipleBirthOrder: string;
  birthOrder: string;
  weight: string;
}
