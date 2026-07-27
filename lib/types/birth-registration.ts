import { AddressValue } from "@/components/reusable/AddressSelector";

export interface BirthRegistrationData {
  address: AddressValue;

  // child
  childFirstName: string;
  childMiddleName: string;
  childLastName: string;

  gender: string;
  childBirthDate: string;

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

  // father
  // father
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;

  fatherCitizenship: string;
  fatherReligion: string;
  fatherOccupation: string;
  fatherAge: string;

  fatherResidence: AddressValue;
  fatherHouseOrSt: string;

  // marraige
  marriageDate: string;

  marriagePlace: AddressValue;
  marriageHouseOrSt: string;

  // attendant
  attendantType: string; // Physician | Nurse | Midwife | Hilot | Others

  attendantName: string;
  attendantAddress: string;
  attendantPosition: string;

  attendantCertificationDate: string;
  attendantCertificationTime: string;

  // informant
  informantSignature: string;
  informantName: string;
  informantRelationship: string;
  informantAddress: string;
  informantDate: string;
}
