"use client";

import React from "react";
import FormPreviewContainer from "./FormPreviewContainer";
import { BirthRegistrationData } from "@/lib/types/birth-registration";
import { getProfile } from "@/server/hooks/authHooks";

interface BirthCertificatePreviewProps {
  childData: BirthRegistrationData;
  previewMode?: "registration" | "record";
}

/**
 * Coordinates are based on the original certificate image:
 * width  = 850
 * height = 1100
 */
const CERTIFICATE_WIDTH = 850;
const CERTIFICATE_HEIGHT = 1100;

const x = (value: number) => `${(value / CERTIFICATE_WIDTH) * 100}%`;

const y = (value: number) => `${(value / CERTIFICATE_HEIGHT) * 100}%`;

interface CertificateFieldProps {
  value?: React.ReactNode;

  xPos: number;
  yPos: number;

  width?: number;
  height?: number;

  fontSize?: number;
  minFontSize?: number;
  fontScale?: number;

  center?: boolean;
  bold?: boolean;

  className?: string;
}

const CertificateField = ({
  value,
  xPos,
  yPos,
  width,
  height = 20,
  fontSize = 12,
  minFontSize = 6,
  fontScale = 1,
  center = false,
  bold = false,
  className = "",
}: CertificateFieldProps) => {
  const stringValue =
    typeof value === "string" || typeof value === "number" ? String(value) : "";

  /**
   * Estimate whether text needs to shrink.
   *
   * This avoids long names/addresses overflowing into
   * neighboring certificate fields.
   */
  const calculateFontSize = () => {
    const scaledFontSize = fontSize * fontScale;
    const scaledMinFontSize = minFontSize * fontScale;

    if (!width || !stringValue) {
      return scaledFontSize;
    }

    /*
     * Rough estimate of how many characters fit in the field.
     * The selected preview mode is included in the calculation so
     * larger record-preview text still shrinks when necessary.
     */
    const estimatedCharacters = width / (scaledFontSize * 0.55);

    if (stringValue.length <= estimatedCharacters) {
      return scaledFontSize;
    }

    const ratio = estimatedCharacters / stringValue.length;

    return Math.max(scaledMinFontSize, Math.floor(scaledFontSize * ratio));
  };

  const actualFontSize = calculateFontSize();

  return (
    <span
      className={`absolute birth-font ${className}`}
      title={stringValue || undefined}
      style={{
        top: y(yPos),
        left: x(xPos),

        ...(width
          ? {
              width: x(width),
            }
          : {}),

        ...(height
          ? {
              height: y(height),
            }
          : {}),

        fontSize: `${actualFontSize}px`,

        overflow: "hidden",
        whiteSpace: "nowrap",

        lineHeight: 1,

        display: "flex",
        alignItems: "center",

        justifyContent: center ? "center" : "flex-start",

        fontWeight: bold ? 700 : undefined,
      }}
    >
      {value}
    </span>
  );
};

export default function BirthCertificatePreview({
  childData,
  previewMode = "registration",
}: BirthCertificatePreviewProps) {
  const fontScale = previewMode === "record" ? 16 / 12 : 1;

  const PreviewField = (props: CertificateFieldProps) => (
    <CertificateField {...props} fontScale={fontScale} />
  );
  /**
   * Converts:
   *
   * "City Of Kabankalan"
   *
   * to:
   *
   * "Kabankalan City"
   */
  const formatCityName = (cityName?: string) => {
    if (!cityName) return "";

    return cityName.replace(/^City Of\s+/i, "") + " City";
  };

  /**
   * Build an address as one single string.
   *
   * This is important because rendering each address
   * part using separate flex children caused overflow.
   */
  const buildAddress = (
    houseOrStreet: string,
    address: {
      barangayName?: string;
      cityName?: string;
      provinceName?: string;
    },
  ) => {
    return [
      houseOrStreet,
      address.barangayName,
      formatCityName(address.cityName),
      address.provinceName,
      address.provinceName ? "Philippines" : "",
    ]
      .filter(Boolean)
      .join(", ");
  };

  /**
   * Place of birth
   */
  const placeOfBirth = [
    childData.hospitalName,
    childData.placeOfBirth.barangayName,
    formatCityName(childData.placeOfBirth.cityName),
    childData.placeOfBirth.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  /**
   * Mother's residence
   */
  const motherAddress = buildAddress(
    childData.motherHouserOrSt,
    childData.motherResidence,
  );

  /**
   * Father's residence
   */
  const fatherAddress = buildAddress(
    childData.fatherHouseOrSt,
    childData.fatherResidence,
  );

  /**
   * Place of marriage
   */
  const marriagePlace = [
    formatCityName(childData.marriagePlace.cityName),
    childData.marriagePlace.provinceName,
    childData.marriagePlace.provinceName ? "Philippines" : "",
  ]
    .filter(Boolean)
    .join(", ");

  /**
   * Child birth date
   */
  const birthDate = childData.childBirthDate
    ? new Date(childData.childBirthDate)
    : null;

  const isValidDate = birthDate && !Number.isNaN(birthDate.getTime());

  const day = isValidDate ? birthDate.getDate() : "";

  const month = isValidDate
    ? birthDate.toLocaleString("en-US", {
        month: "long",
      })
    : "";

  const year = isValidDate ? birthDate.getFullYear() : "";

  /**
   * Parents' marriage date
   */
  const parentMarriageDate = childData.marriageDate
    ? new Date(childData.marriageDate)
    : null;

  const isValidMarriageDate =
    parentMarriageDate && !Number.isNaN(parentMarriageDate.getTime());

  const marriageDay = isValidMarriageDate ? parentMarriageDate.getDate() : "";

  const marriageMonth = isValidMarriageDate
    ? parentMarriageDate.toLocaleDateString("en-US", {
        month: "long",
      })
    : "";

  const marriageYear = isValidMarriageDate
    ? parentMarriageDate.getFullYear()
    : "";

  /**
   * Convert 24-hour time into readable time.
   *
   * 14:30 -> 2:30
   */
  const formatTime = (time: string) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":").map(Number);

    const displayHour = hours % 12 || 12;

    return `${displayHour}:${minutes.toString().padStart(2, "0")}`;
  };

  /**
   * Logged-in staff information
   */
  const { data } = getProfile();

  /**
   * Prepared date
   */
  const today = new Date();

  const formattedToday = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log("child data: ", childData);

  return (
    <FormPreviewContainer imageSrc="/assets/birth_form.jpg">
      {/* ====================================== */}
      {/* REGISTRATION ADDRESS */}
      {/* ====================================== */}

      <PreviewField
        value={childData.address.provinceName}
        xPos={150}
        yPos={100}
        width={450}
      />

      <PreviewField
        value={formatCityName(childData.address.cityName)}
        xPos={190}
        yPos={120}
        width={400}
      />

      {/* ====================================== */}
      {/* CHILD */}
      {/* ====================================== */}

      {/* First Name */}
      <PreviewField
        value={childData.childFirstName}
        xPos={180}
        yPos={160}
        width={190}
      />

      {/* Middle Name */}
      <PreviewField
        value={childData.childMiddleName}
        xPos={400}
        yPos={160}
        width={180}
      />

      {/* Last Name */}
      <PreviewField
        value={childData.childLastName}
        xPos={600}
        yPos={160}
        width={190}
      />

      {/* Sex */}
      <PreviewField
        value={childData.gender}
        xPos={150}
        yPos={188}
        width={130}
      />

      {/* Birth Day */}
      <PreviewField value={day} xPos={450} yPos={188} width={70} />

      {/* Birth Month */}
      <PreviewField value={month} xPos={570} yPos={188} width={100} />

      {/* Birth Year */}
      <PreviewField value={year} xPos={700} yPos={188} width={100} />

      {/* ====================================== */}
      {/* PLACE OF BIRTH */}
      {/* ====================================== */}

      <PreviewField
        value={placeOfBirth}
        xPos={90}
        yPos={220}
        width={700}
        height={22}
        fontSize={12}
        minFontSize={6}
        bold
      />

      {/* ====================================== */}
      {/* BIRTH INFORMATION */}
      {/* ====================================== */}

      {/* Type */}
      <PreviewField
        value={childData.typeOfBirth}
        xPos={190}
        yPos={265}
        width={140}
      />

      {/* Multiple birth order */}
      <PreviewField
        value={childData.multipleBirthOrder}
        xPos={360}
        yPos={265}
        width={150}
      />

      {/* Birth order */}
      <PreviewField
        value={childData.birthOrder}
        xPos={540}
        yPos={265}
        width={120}
      />

      {/* Weight */}
      <PreviewField
        value={childData.weight}
        xPos={690}
        yPos={265}
        width={100}
      />

      {/* ====================================== */}
      {/* MOTHER */}
      {/* ====================================== */}

      {/* First */}
      <PreviewField
        value={childData.motherFirstName}
        xPos={200}
        yPos={300}
        width={180}
      />

      {/* Middle */}
      <PreviewField
        value={childData.motherMiddleName}
        xPos={400}
        yPos={300}
        width={180}
      />

      {/* Last */}
      <PreviewField
        value={childData.motherLastName}
        xPos={600}
        yPos={300}
        width={190}
      />

      {/* Citizenship */}
      <PreviewField
        value={childData.motherCitizenship}
        xPos={200}
        yPos={325}
        width={200}
      />

      {/* Religion */}
      <PreviewField
        value={childData.motherReligion}
        xPos={600}
        yPos={325}
        width={180}
      />

      {/* Total children */}
      <PreviewField
        value={childData.totalNumOfChildren}
        xPos={120}
        yPos={370}
        width={60}
      />

      {/* Children living */}
      <PreviewField
        value={childData.noOfChildrenAlive}
        xPos={200}
        yPos={370}
        width={100}
      />

      {/* Children dead */}
      <PreviewField
        value={childData.noOfChildrenDead}
        xPos={380}
        yPos={370}
        width={80}
      />

      {/* Occupation */}
      <PreviewField
        value={childData.motherOccupation}
        xPos={500}
        yPos={367}
        width={150}
      />

      {/* Age */}
      <PreviewField
        value={childData.motherAge}
        xPos={710}
        yPos={367}
        width={70}
      />

      {/* ====================================== */}
      {/* MOTHER RESIDENCE */}
      {/* FIXED OVERFLOW ISSUE HERE */}
      {/* ====================================== */}

      <PreviewField
        value={motherAddress}
        xPos={80}
        yPos={400}
        width={720}
        height={21}
        fontSize={12}
        minFontSize={6}
        bold
      />

      {/* ====================================== */}
      {/* FATHER */}
      {/* ====================================== */}

      {/* First */}
      <PreviewField
        value={childData.fatherFirstName}
        xPos={200}
        yPos={430}
        width={180}
      />

      {/* Middle */}
      <PreviewField
        value={childData.fatherMiddleName}
        xPos={400}
        yPos={430}
        width={180}
      />

      {/* Last */}
      <PreviewField
        value={childData.fatherLastName}
        xPos={600}
        yPos={430}
        width={190}
      />

      {/* Citizenship */}
      <PreviewField
        value={childData.fatherCitizenship}
        xPos={170}
        yPos={470}
        width={120}
      />

      {/* Religion */}
      <PreviewField
        value={childData.fatherReligion}
        xPos={300}
        yPos={470}
        width={180}
      />

      {/* Occupation */}
      <PreviewField
        value={childData.fatherOccupation}
        xPos={530}
        yPos={470}
        width={130}
      />

      {/* Age */}
      <PreviewField
        value={childData.fatherAge}
        xPos={700}
        yPos={472}
        width={80}
      />

      {/* ====================================== */}
      {/* FATHER RESIDENCE */}
      {/* ====================================== */}

      <PreviewField
        value={fatherAddress}
        xPos={80}
        yPos={500}
        width={720}
        height={21}
        fontSize={12}
        minFontSize={6}
        bold
      />

      {/* ====================================== */}
      {/* MARRIAGE */}
      {/* ====================================== */}

      {/* Month */}
      <PreviewField value={marriageMonth} xPos={160} yPos={550} width={60} />

      {/* Day */}
      <PreviewField value={marriageDay} xPos={220} yPos={550} width={40} />

      {/* Year */}
      <PreviewField value={marriageYear} xPos={270} yPos={550} width={60} />

      {/* Place */}
      <PreviewField
        value={marriagePlace}
        xPos={350}
        yPos={550}
        width={440}
        fontSize={9}
        minFontSize={6}
      />

      {/* ====================================== */}
      {/* ATTENDANT */}
      {/* ====================================== */}

      {/* Attendant Type X Marker */}
      {childData.attendantType && (
        <PreviewField
          value="X"
          xPos={
            childData.attendantType === "Physician"
              ? 70
              : childData.attendantType === "Nurse"
                ? 180
                : childData.attendantType === "Midwife"
                  ? 270
                  : childData.attendantType === "Hilot"
                    ? 370
                    : childData.attendantType === "Others"
                      ? 580
                      : 0
          }
          yPos={590}
          width={20}
          fontSize={12}
          bold
          className="font-mono"
        />
      )}

      {/* Certification Time */}
      <PreviewField
        value={formatTime(childData.attendantCertificationTime)}
        xPos={500}
        yPos={620}
        width={100}
      />

      {/* Attendant Name */}
      <PreviewField
        value={childData.attendantName}
        xPos={200}
        yPos={658}
        width={250}
        fontSize={12}
        minFontSize={6}
      />

      {/* Attendant Address */}
      <PreviewField
        value={childData.attendantAddress}
        xPos={500}
        yPos={640}
        width={280}
        height={40}
        fontSize={12}
        minFontSize={6}
      />

      {/* Position */}
      <PreviewField
        value={childData.attendantPosition}
        xPos={200}
        yPos={680}
        width={220}
        fontSize={12}
        minFontSize={6}
      />

      {/* Certification Date */}
      <PreviewField
        value={childData.attendantCertificationDate}
        xPos={500}
        yPos={680}
        width={200}
        fontSize={12}
      />

      {/* ====================================== */}
      {/* INFORMANT */}
      {/* ====================================== */}

      {/* Name */}
      <PreviewField
        value={childData.informantName}
        xPos={150}
        yPos={760}
        width={280}
        fontSize={12}
        minFontSize={6}
      />

      {/* Relationship */}
      <PreviewField
        value={childData.informantRelationship}
        xPos={200}
        yPos={775}
        width={200}
        fontSize={12}
        minFontSize={6}
      />

      {/* Address */}
      <PreviewField
        value={childData.informantAddress}
        xPos={110}
        yPos={795}
        width={340}
        height={18}
        fontSize={12}
        minFontSize={5}
      />

      {/* Date */}
      <PreviewField
        value={childData.informantDate}
        xPos={100}
        yPos={810}
        width={200}
        fontSize={12}
      />

      {/* ====================================== */}
      {/* PREPARED BY */}
      {/* ====================================== */}

      {/* Name */}
      <PreviewField
        value={
          data?.data
            ? `${data.data.first_name ?? ""} ${
                data.data.last_name ?? ""
              }`.trim()
            : ""
        }
        xPos={560}
        yPos={760}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      {/* Position */}
      <PreviewField
        value={data?.data?.position}
        xPos={560}
        yPos={780}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      {/* Date */}
      <PreviewField
        value={formattedToday}
        xPos={510}
        yPos={800}
        width={280}
        fontSize={12}
        minFontSize={6}
      />
    </FormPreviewContainer>
  );
}
