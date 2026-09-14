import { AddressValue } from "@/components/reusable/AddressSelector";

export interface PreparedByData {
  id: string;
  firstName: string;
  lastName: string;
  position: string | null;
}

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
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  fatherCitizenship: string;
  fatherReligion: string;
  fatherOccupation: string;
  fatherAge: string;
  fatherResidence: AddressValue;
  fatherHouseOrSt: string;

  // marriage
  marriageDate: string;
  marriagePlace: AddressValue;
  marriageHouseOrSt: string;

  // attendant
  attendantType: string;
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

  // prepared by
  preparedBy?: PreparedByData | null;
  preparedAt?: string;
}
