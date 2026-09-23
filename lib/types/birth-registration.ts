import { AddressValue } from "@/components/reusable/AddressSelector";

// ============================================================
// USER DISPLAY DATA
// ============================================================

export interface CertificateUserData {
  id: string;
  first_name: string;
  last_name: string;
  position: string | null;
}

// ============================================================
// FORM DATA
// ============================================================

export interface BirthRegistrationData {
  registryNumber: string;
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
}

// ============================================================
// DATABASE RECORD
// ============================================================

export interface BirthRegistrationRecord {
  id: string;
  registryNumber?: string | null;

  address: any;

  preparedById: string | null;
  receivedById: string | null;
  registrarId: string | null;

  child: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    placeOfBirth: any;
    hospitalName: string;
    typeOfBirth: string;
    multipleBirthOrder: string;
    birthOrder: string;
    weight: string;
  } | null;

  mother: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    citizenship: string;
    religion: string;
    totalNumOfChildren: string;
    noOfChildrenAlive: string;
    noOfChildrenDead: string;
    occupation: string;
    age: string;
    residence: any;
    houseOrStreet: string;
  } | null;

  father: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    citizenship: string;
    religion: string;
    occupation: string;
    age: string;
    residence: any;
    houseOrStreet: string;
  } | null;

  parentsMarriage: {
    id: string;
    marriageDate: string;
    marriagePlace: any;
    houseOrStreet: string;
  } | null;

  attendant: {
    id: string;
    type: string;
    name: string;
    address: string;
    position: string;
    certificationDate: string;
    certificationTime: string;
  } | null;

  informant: {
    id: string;
    signature: string;
    name: string;
    relationship: string;
    address: string;
    date: string;
  } | null;

  preparedByUser: CertificateUserData | null;
  receivedByUser: CertificateUserData | null;
  registrar: CertificateUserData | null;

  createdAt: string;
  updatedAt: string;
}
