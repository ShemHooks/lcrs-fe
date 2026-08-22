import { DeathRegistrationData } from "@/lib/types/death-registration";

const emptyAddress = {
  regionCode: "",
  regionName: "",
  provinceCode: "",
  provinceName: "",
  cityCode: "",
  cityName: "",
  barangayCode: "",
  barangayName: "",
};

export const initialDeathRegistrationData: DeathRegistrationData = {
  // Header
  province: "",
  cityMunicipality: "",
  registryNumber: "",

  // Deceased Name
  firstName: "",
  middleName: "",
  lastName: "",

  // Sex
  sex: "",

  // Date of Death
  dateOfDeath: "",

  // Date of Birth
  dateOfBirth: "",

  // Age at Time of Death
  ageYears: "",
  ageMonths: "",
  ageDays: "",
  ageHours: "",
  ageMinutes: "",

  // Place of Death
  placeOfDeath: "",
  placeOfDeathAddress: { ...emptyAddress },
  placeOfDeathHouseOrStreet: "",

  // Civil Status
  civilStatus: "",

  // Religion
  religion: "",

  // Citizenship
  citizenship: "",

  // Residence
  residence: { ...emptyAddress },
  residenceHouseOrStreet: "",

  // Occupation
  occupation: "",

  // Father
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherLastName: "",

  // Mother
  motherFirstName: "",
  motherMiddleName: "",
  motherLastName: "",

  // Medical Certificate - Causes of Death
  immediateCause: "",
  immediateCauseInterval: "",
  antecedentCause: "",
  antecedentCauseInterval: "",
  underlyingCause: "",
  underlyingCauseInterval: "",
  otherSignificantConditions: "",

  // Maternal Condition
  maternalCondition: "",

  // Death by External Causes
  mannerOfDeath: "",
  placeOfExternalCause: "",

  // Autopsy
  autopsy: "",

  // Attendant
  attendantType: "",
  attendantOtherSpecify: "",
  attendedFrom: "",
  attendedTo: "",

  // Certification of Death
  certifierSignature: "",
  certifierName: "",
  certifierPosition: "",
  certifierAddress: "",

  // Reviewed By
  healthOfficerSignature: "",
  healthOfficerDate: "",

  // Corpse Disposal
  corpseDisposal: "",

  // Burial/Cremation Permit
  burialPermitNumber: "",
  burialPermitDateIssued: "",

  // Transfer Permit
  transferPermitNumber: "",
  transferPermitDateIssued: "",

  // Cemetery/Crematory
  cemeteryOrCrematory: "",

  // Certification of Informant
  informantSignature: "",
  informantName: "",
  informantRelationship: "",
  informantAddress: "",
  informantDate: "",

  // Prepared By
  preparedBySignature: "",
  preparedByName: "",
  preparedByPosition: "",
  preparedByDate: "",

  // Received By
  receivedBySignature: "",
  receivedByName: "",
  receivedByPosition: "",
  receivedByDate: "",

  // Registered By Civil Registrar
  registeredBySignature: "",
  registeredByName: "",
  registeredByPosition: "",
  registeredByDate: "",

  // Remarks
  remarks: "",
};
