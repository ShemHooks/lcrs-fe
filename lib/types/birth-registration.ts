import { AddressValue } from "@/components/reusable/AddressSelector";

export interface BirthRegistrationData {
  address: AddressValue;

  // child
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

  // mother
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  motherCitizenship: string;
  motherReligion: string;
  totalNumOfChildren: string;
  noOfChildrenAlive: string;
  noOfChildrenDead: string;
  motherOccupation: string;
  motherAge: string;
  motherResidence: AddressValue;
  motherHouserOrSt: string;
}
