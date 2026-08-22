import { MarriageRegistrationData } from "@/lib/types/marriage-registration";

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

export const initialMarriageRegistrationData: MarriageRegistrationData = {
  // Header
  province: "",
  cityMunicipality: "",
  registryNumber: "",

  // GROOM
  groomFirstName: "",
  groomMiddleName: "",
  groomLastName: "",

  groomBirthDate: "",
  groomAge: "",

  groomPlaceOfBirth: "",
  groomSex: "",
  groomCitizenship: "",

  groomResidence: { ...emptyAddress },
  groomHouseOrStreet: "",

  groomReligion: "",
  groomCivilStatus: "",

  groomFatherFirstName: "",
  groomFatherMiddleName: "",
  groomFatherLastName: "",
  groomFatherCitizenship: "",

  groomMotherFirstName: "",
  groomMotherMiddleName: "",
  groomMotherLastName: "",
  groomMotherCitizenship: "",

  groomGuardianFirstName: "",
  groomGuardianMiddleName: "",
  groomGuardianLastName: "",
  groomGuardianRelationship: "",
  groomGuardianResidence: { ...emptyAddress },
  groomGuardianHouseOrStreet: "",

  // BRIDE
  brideFirstName: "",
  brideMiddleName: "",
  brideLastName: "",

  brideBirthDate: "",
  brideAge: "",

  bridePlaceOfBirth: "",
  brideSex: "",
  brideCitizenship: "",

  brideResidence: { ...emptyAddress },
  brideHouseOrStreet: "",

  brideReligion: "",
  brideCivilStatus: "",

  brideFatherFirstName: "",
  brideFatherMiddleName: "",
  brideFatherLastName: "",
  brideFatherCitizenship: "",

  brideMotherFirstName: "",
  brideMotherMiddleName: "",
  brideMotherLastName: "",
  brideMotherCitizenship: "",

  brideGuardianFirstName: "",
  brideGuardianMiddleName: "",
  brideGuardianLastName: "",
  brideGuardianRelationship: "",
  brideGuardianResidence: { ...emptyAddress },
  brideGuardianHouseOrStreet: "",

  // Marriage Details
  placeOfMarriage: "",
  placeOfMarriageCity: "",
  placeOfMarriageProvince: "",
  dateOfMarriage: "",
  timeOfMarriage: "",

  // Solemnizing Officer
  solemnizingOfficerName: "",
  solemnizingOfficerPosition: "",
  solemnizingOfficerReligion: "",
  solemnizingOfficerRegistryNo: "",
  solemnizingOfficerExpiryDate: "",

  // Witnesses
  witness1Name: "",
  witness1Signature: "",
  witness2Name: "",
  witness2Signature: "",

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
