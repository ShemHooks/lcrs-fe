import { AddressValue } from "@/components/reusable/AddressSelector";

export interface DeathRegistrationData {
  // Header
  province: string;
  cityMunicipality: string;
  registryNumber: string;

  // Deceased Name (1)
  firstName: string;
  middleName: string;
  lastName: string;

  // Sex (2)
  sex: string;

  // Date of Death (3)
  dateOfDeath: string;

  // Date of Birth (4)
  dateOfBirth: string;

  // Age at Time of Death (5)
  ageYears: string;
  ageMonths: string;
  ageDays: string;
  ageHours: string;
  ageMinutes: string;

  // Place of Death (6)
  placeOfDeath: string;
  placeOfDeathAddress: AddressValue;
  placeOfDeathHouseOrStreet: string;

  // Civil Status (7)
  civilStatus: string;

  // Religion (8)
  religion: string;

  // Citizenship (9)
  citizenship: string;

  // Residence (10)
  residence: AddressValue;
  residenceHouseOrStreet: string;

  // Occupation (11)
  occupation: string;

  // Father (12)
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;

  // Mother (13)
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;

  // Medical Certificate - Causes of Death (19b)
  immediateCause: string;
  immediateCauseInterval: string;
  antecedentCause: string;
  antecedentCauseInterval: string;
  underlyingCause: string;
  underlyingCauseInterval: string;
  otherSignificantConditions: string;

  // Maternal Condition (19c) - if female 15-49
  maternalCondition: string;

  // Death by External Causes (19d)
  mannerOfDeath: string;
  placeOfExternalCause: string;

  // Autopsy (20)
  autopsy: string;

  // Attendant (21a)
  attendantType: string;
  attendantOtherSpecify: string;
  attendedFrom: string;
  attendedTo: string;

  // Certification of Death (22)
  certifierSignature: string;
  certifierName: string;
  certifierPosition: string;
  certifierAddress: string;

  // Reviewed By
  healthOfficerSignature: string;
  healthOfficerDate: string;

  // Corpse Disposal (23)
  corpseDisposal: string;

  // Burial/Cremation Permit (24a)
  burialPermitNumber: string;
  burialPermitDateIssued: string;

  // Transfer Permit (24b)
  transferPermitNumber: string;
  transferPermitDateIssued: string;

  // Cemetery/Crematory (25)
  cemeteryOrCrematory: string;

  // Certification of Informant (26)
  informantSignature: string;
  informantName: string;
  informantRelationship: string;
  informantAddress: string;
  informantDate: string;

  // Prepared By (27)
  preparedBySignature: string;
  preparedByName: string;
  preparedByPosition: string;
  preparedByDate: string;

  // Received By (28)
  receivedBySignature: string;
  receivedByName: string;
  receivedByPosition: string;
  receivedByDate: string;

  // Registered By Civil Registrar (29)
  registeredBySignature: string;
  registeredByName: string;
  registeredByPosition: string;
  registeredByDate: string;

  // Remarks / Annotations
  remarks: string;
}

export interface DeathRegistrationRecord {
  id: string;
  registry_number: string | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  sex: string;
  date_of_death: string;
  place_of_death: string;
  cause_of_death: string;
  death_informant_full_name: string;
  relation_to_deceased: string;
  createdAt: string;
  updatedAt: string;
}
