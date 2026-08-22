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
 * Safe JSON Parse Helper
 * =========================
 */

/**
 * The API currently returns address-like fields as JSON strings
 * (e.g. `"{\"provinceName\":\"...\"}"`) instead of parsed objects.
 *
 * This normalizes either shape (string or already-parsed object)
 * into a plain object so the rest of the mapper doesn't need to
 * care which one it got. Falls back to `{}` on null/undefined/
 * malformed input so downstream `??` fallbacks still work.
 */
const parseMaybeJson = (value: unknown): Record<string, any> => {
  if (!value) return {};

  if (typeof value === "object") {
    return value as Record<string, any>;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      console.warn("Failed to parse address JSON:", value);
      return {};
    }
  }

  return {};
};

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
 * Accepts either a JSON string or an already-parsed object
 * (see `parseMaybeJson`), since the API currently sends
 * address-like fields as stringified JSON.
 *
 * If your backend eventually returns PSGC codes,
 * they can be populated here.
 */
const mapAddressToForm = (
  address: unknown,
): BirthRegistrationData["address"] => {
  const parsed = parseMaybeJson(address);

  return {
    regionCode: parsed.regionCode ?? "",
    regionName: parsed.regionName ?? "",

    provinceCode: parsed.provinceCode ?? "",
    provinceName: parsed.provinceName ?? parsed.province ?? "",

    cityCode: parsed.cityCode ?? "",
    cityName: parsed.cityName ?? parsed.city ?? "",

    barangayCode: parsed.barangayCode ?? "",
    barangayName: parsed.barangayName ?? "",
  };
};

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
    // Address (string or object, both handled)
    address: mapAddressToForm(record.address),

    // =========================
    // Child
    // =========================

    childFirstName: record.child?.firstName ?? "",
    childMiddleName: record.child?.middleName ?? "",
    childLastName: record.child?.lastName ?? "",

    gender: record.child?.gender ?? "",
    childBirthDate: record.child?.birthDate ?? "",

    placeOfBirth: mapAddressToForm(record.child?.placeOfBirth),

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

    motherResidence: mapAddressToForm(record.mother?.residence),

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

    fatherResidence: mapAddressToForm(record.father?.residence),

    fatherHouseOrSt: record.father?.houseOrStreet ?? "",

    // =========================
    // Marriage
    // =========================

    marriageDate: record.parentsMarriage?.marriageDate ?? "",

    marriagePlace: mapAddressToForm(record.parentsMarriage?.marriagePlace),

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
