import {
  BirthRegistrationData,
  BirthRegistrationRecord,
} from "@/lib/types/birth-registration";

/**
 * =========================
 * Address Types
 * =========================
 */

export interface ApiAddress {
  provinceName: string;
  cityName: string;
}

/**
 * =========================
 * Default Address
 * =========================
 */

export const emptyAddress = (): BirthRegistrationData["address"] => ({
  regionCode: "",
  regionName: "",
  provinceCode: "",
  provinceName: "",
  cityCode: "",
  cityName: "",
  barangayCode: "",
  barangayName: "",
});

/**
 * =========================
 * Address Mapper
 * =========================
 */

/**
 * Form Address → API Address
 *
 * The form keeps PSGC codes and names because they are
 * required by the cascading address selector.
 *
 * The API only receives the human-readable province and city.
 */
const mapAddressToApi = (
  address: BirthRegistrationData["address"],
): ApiAddress => ({
  provinceName: address?.provinceName ?? "",
  cityName: address?.cityName ?? "",
});

/**
 * API Address → Form Address
 *
 * The API only gives us province/city names, so the
 * selector codes will initially be empty.
 *
 * If your backend eventually returns PSGC codes,
 * they can be populated here.
 */
const mapAddressToForm = (address: any): BirthRegistrationData["address"] => ({
  regionCode: address?.regionCode ?? "",
  regionName: address?.regionName ?? "",

  provinceCode: address?.provinceCode ?? "",
  provinceName: address?.provinceName ?? address?.province ?? "",

  cityCode: address?.cityCode ?? "",
  cityName: address?.cityName ?? address?.city ?? "",

  barangayCode: address?.barangayCode ?? "",
  barangayName: address?.barangayName ?? "",
});

/**
 * =========================
 * API Payload Type
 * =========================
 */

export type BirthRegistrationApiPayload = Omit<
  BirthRegistrationData,
  | "address"
  | "placeOfBirth"
  | "motherResidence"
  | "fatherResidence"
  | "marriagePlace"
> & {
  address: ApiAddress;
  placeOfBirth: ApiAddress;
  motherResidence: ApiAddress;
  fatherResidence: ApiAddress;
  marriagePlace: ApiAddress;
};

/**
 * =========================
 * API → FORM
 * =========================
 */

export const mapBirthRecordToFormData = (
  record: BirthRegistrationRecord,
): BirthRegistrationData => {
  return {
    // Address
    address: mapAddressToForm(record.address),

    // =========================
    // Child
    // =========================

    childFirstName: record.child?.firstName ?? "",
    childMiddleName: record.child?.middleName ?? "",
    childLastName: record.child?.lastName ?? "",

    gender: record.child?.gender ?? "",
    childBirthDate: record.child?.birthDate ?? "",

    placeOfBirth: record.child?.placeOfBirth
      ? mapAddressToForm(record.child.placeOfBirth)
      : emptyAddress(),

    hospitalName: record.child?.hospitalName ?? "",

    typeOfBirth: record.child?.typeOfBirth ?? "",
    multipleBirthOrder: record.child?.multipleBirthOrder ?? "",
    birthOrder: record.child?.birthOrder ?? "",
    weight: record.child?.weight ?? "",

    // =========================
    // Mother
    // =========================

    motherFirstName: record.mother?.firstName ?? "",
    motherMiddleName: record.mother?.middleName ?? "",
    motherLastName: record.mother?.lastName ?? "",

    motherCitizenship: record.mother?.citizenship ?? "",
    motherReligion: record.mother?.religion ?? "",

    totalNumOfChildren: record.mother?.totalNumOfChildren ?? "",
    noOfChildrenAlive: record.mother?.noOfChildrenAlive ?? "",
    noOfChildrenDead: record.mother?.noOfChildrenDead ?? "",

    motherOccupation: record.mother?.occupation ?? "",
    motherAge: record.mother?.age ?? "",

    motherResidence: record.mother?.residence
      ? mapAddressToForm(record.mother.residence)
      : emptyAddress(),

    motherHouserOrSt: record.mother?.houseOrStreet ?? "",

    // =========================
    // Father
    // =========================

    fatherFirstName: record.father?.firstName ?? "",
    fatherMiddleName: record.father?.middleName ?? "",
    fatherLastName: record.father?.lastName ?? "",

    fatherCitizenship: record.father?.citizenship ?? "",
    fatherReligion: record.father?.religion ?? "",

    fatherOccupation: record.father?.occupation ?? "",
    fatherAge: record.father?.age ?? "",

    fatherResidence: record.father?.residence
      ? mapAddressToForm(record.father.residence)
      : emptyAddress(),

    fatherHouseOrSt: record.father?.houseOrStreet ?? "",

    // =========================
    // Marriage
    // =========================

    marriageDate: record.parentsMarriage?.marriageDate ?? "",

    marriagePlace: record.parentsMarriage?.marriagePlace
      ? mapAddressToForm(record.parentsMarriage.marriagePlace)
      : emptyAddress(),

    marriageHouseOrSt: record.parentsMarriage?.houseOrStreet ?? "",

    // =========================
    // Attendant
    // =========================

    attendantType: record.attendant?.type ?? "",
    attendantName: record.attendant?.name ?? "",
    attendantAddress: record.attendant?.address ?? "",
    attendantPosition: record.attendant?.position ?? "",
    attendantCertificationDate: record.attendant?.certificationDate ?? "",
    attendantCertificationTime: record.attendant?.certificationTime ?? "",

    // =========================
    // Informant
    // =========================

    informantSignature: record.informant?.signature ?? "",
    informantName: record.informant?.name ?? "",
    informantRelationship: record.informant?.relationship ?? "",
    informantAddress: record.informant?.address ?? "",
    informantDate: record.informant?.date ?? "",
  };
};

/**
 * =========================
 * FORM → API
 * =========================
 */

export const mapBirthFormDataToApi = (
  formData: BirthRegistrationData,
): BirthRegistrationApiPayload => {
  return {
    ...formData,

    // Address
    address: mapAddressToApi(formData.address),

    // Child
    placeOfBirth: mapAddressToApi(formData.placeOfBirth),

    // Mother
    motherResidence: mapAddressToApi(formData.motherResidence),

    // Father
    fatherResidence: mapAddressToApi(formData.fatherResidence),

    // Marriage
    marriagePlace: mapAddressToApi(formData.marriagePlace),
  };
};
