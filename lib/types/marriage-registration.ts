import { AddressValue } from "@/components/reusable/AddressSelector";

export interface MarriageRegistrationData {
  // Header
  province: string;
  cityMunicipality: string;
  registryNumber: string;

  // HUSBAND / GROOM
  groomFirstName: string;
  groomMiddleName: string;
  groomLastName: string;

  groomBirthDate: string;
  groomAge: string;

  groomPlaceOfBirth: string;
  groomSex: string;
  groomCitizenship: string;

  groomResidence: AddressValue;
  groomHouseOrStreet: string;

  groomReligion: string;
  groomCivilStatus: string;

  // Groom's Father
  groomFatherFirstName: string;
  groomFatherMiddleName: string;
  groomFatherLastName: string;
  groomFatherCitizenship: string;

  // Groom's Mother (Maiden Name)
  groomMotherFirstName: string;
  groomMotherMiddleName: string;
  groomMotherLastName: string;
  groomMotherCitizenship: string;

  // Groom's Guardian / Person Who Gave Consent
  groomGuardianFirstName: string;
  groomGuardianMiddleName: string;
  groomGuardianLastName: string;
  groomGuardianRelationship: string;
  groomGuardianResidence: AddressValue;
  groomGuardianHouseOrStreet: string;

  // WIFE / BRIDE
  brideFirstName: string;
  brideMiddleName: string;
  brideLastName: string;

  brideBirthDate: string;
  brideAge: string;

  bridePlaceOfBirth: string;
  brideSex: string;
  brideCitizenship: string;

  brideResidence: AddressValue;
  brideHouseOrStreet: string;

  brideReligion: string;
  brideCivilStatus: string;

  // Bride's Father
  brideFatherFirstName: string;
  brideFatherMiddleName: string;
  brideFatherLastName: string;
  brideFatherCitizenship: string;

  // Bride's Mother (Maiden Name)
  brideMotherFirstName: string;
  brideMotherMiddleName: string;
  brideMotherLastName: string;
  brideMotherCitizenship: string;

  // Bride's Guardian / Person Who Gave Consent
  brideGuardianFirstName: string;
  brideGuardianMiddleName: string;
  brideGuardianLastName: string;
  brideGuardianRelationship: string;
  brideGuardianResidence: AddressValue;
  brideGuardianHouseOrStreet: string;

  // Marriage Details
  placeOfMarriage: string;
  placeOfMarriageCity: string;
  placeOfMarriageProvince: string;
  dateOfMarriage: string;
  timeOfMarriage: string;

  // Solemnizing Officer
  solemnizingOfficerName: string;
  solemnizingOfficerPosition: string;
  solemnizingOfficerReligion: string;
  solemnizingOfficerRegistryNo: string;
  solemnizingOfficerExpiryDate: string;

  // Witnesses
  witness1Name: string;
  witness1Signature: string;
  witness2Name: string;
  witness2Signature: string;

  // Received By
  receivedBySignature: string;
  receivedByName: string;
  receivedByPosition: string;
  receivedByDate: string;

  // Registered By Civil Registrar
  registeredBySignature: string;
  registeredByName: string;
  registeredByPosition: string;
  registeredByDate: string;

  // Remarks / Annotations
  remarks: string;
}

export interface MarriageRegistrationRecord {
  id: string;
  registry_number: string | null;
  groom_first_name: string;
  groom_middle_name: string;
  groom_last_name: string;
  groom_age: number;
  bride_first_name: string;
  bride_middle_name: string;
  bride_last_name: string;
  bride_age: number;
  date_of_marriage: string;
  place_of_marriage: string;
  officiant: string;
  witnesses: any;
  createdAt: string;
  updatedAt: string;
}
