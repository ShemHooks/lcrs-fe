"use client";

import React from "react";
import FormPreviewContainer from "./FormPreviewContainer";
import { BirthRegistrationData } from "@/lib/types/birth-registration";
import { getProfile } from "@/server/hooks/authHooks";

interface BirthCertificatePreviewProps {
  childData: BirthRegistrationData;
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
    if (!width || !stringValue) {
      return fontSize;
    }

    /*
     * Rough estimate of how many characters fit in the field.
     * This works well for certificate previews and avoids
     * needing DOM measurement on every keystroke.
     */
    const estimatedCharacters = width / (fontSize * 0.55);

    if (stringValue.length <= estimatedCharacters) {
      return fontSize;
    }

    const ratio = estimatedCharacters / stringValue.length;

    return Math.max(minFontSize, Math.floor(fontSize * ratio));
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
}: BirthCertificatePreviewProps) {
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

  return (
    <FormPreviewContainer imageSrc="/assets/birth_form.jpg">
      {/* ====================================== */}
      {/* REGISTRATION ADDRESS */}
      {/* ====================================== */}

      <CertificateField
        value={childData.address.provinceName}
        xPos={150}
        yPos={100}
        width={450}
      />

      <CertificateField
        value={formatCityName(childData.address.cityName)}
        xPos={190}
        yPos={120}
        width={400}
      />

      {/* ====================================== */}
      {/* CHILD */}
      {/* ====================================== */}

      {/* First Name */}
      <CertificateField
        value={childData.childFirstName}
        xPos={180}
        yPos={148}
        width={190}
      />

      {/* Middle Name */}
      <CertificateField
        value={childData.childMiddleName}
        xPos={400}
        yPos={148}
        width={180}
      />

      {/* Last Name */}
      <CertificateField
        value={childData.childLastName}
        xPos={600}
        yPos={148}
        width={190}
      />

      {/* Sex */}
      <CertificateField
        value={childData.gender}
        xPos={150}
        yPos={178}
        width={130}
      />

      {/* Birth Day */}
      <CertificateField value={day} xPos={450} yPos={178} width={70} />

      {/* Birth Month */}
      <CertificateField value={month} xPos={570} yPos={178} width={100} />

      {/* Birth Year */}
      <CertificateField value={year} xPos={700} yPos={178} width={100} />

      {/* ====================================== */}
      {/* PLACE OF BIRTH */}
      {/* ====================================== */}

      <CertificateField
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
      <CertificateField
        value={childData.typeOfBirth}
        xPos={190}
        yPos={260}
        width={140}
      />

      {/* Multiple birth order */}
      <CertificateField
        value={childData.multipleBirthOrder}
        xPos={360}
        yPos={260}
        width={150}
      />

      {/* Birth order */}
      <CertificateField
        value={childData.birthOrder}
        xPos={540}
        yPos={260}
        width={120}
      />

      {/* Weight */}
      <CertificateField
        value={childData.weight}
        xPos={690}
        yPos={260}
        width={100}
      />

      {/* ====================================== */}
      {/* MOTHER */}
      {/* ====================================== */}

      {/* First */}
      <CertificateField
        value={childData.motherFirstName}
        xPos={200}
        yPos={290}
        width={180}
      />

      {/* Middle */}
      <CertificateField
        value={childData.motherMiddleName}
        xPos={400}
        yPos={290}
        width={180}
      />

      {/* Last */}
      <CertificateField
        value={childData.motherLastName}
        xPos={600}
        yPos={290}
        width={190}
      />

      {/* Citizenship */}
      <CertificateField
        value={childData.motherCitizenship}
        xPos={200}
        yPos={320}
        width={200}
      />

      {/* Religion */}
      <CertificateField
        value={childData.motherReligion}
        xPos={600}
        yPos={320}
        width={180}
      />

      {/* Total children */}
      <CertificateField
        value={childData.totalNumOfChildren}
        xPos={120}
        yPos={370}
        width={60}
      />

      {/* Children living */}
      <CertificateField
        value={childData.noOfChildrenAlive}
        xPos={200}
        yPos={370}
        width={100}
      />

      {/* Children dead */}
      <CertificateField
        value={childData.noOfChildrenDead}
        xPos={380}
        yPos={370}
        width={80}
      />

      {/* Occupation */}
      <CertificateField
        value={childData.motherOccupation}
        xPos={500}
        yPos={367}
        width={150}
      />

      {/* Age */}
      <CertificateField
        value={childData.motherAge}
        xPos={710}
        yPos={367}
        width={70}
      />

      {/* ====================================== */}
      {/* MOTHER RESIDENCE */}
      {/* FIXED OVERFLOW ISSUE HERE */}
      {/* ====================================== */}

      <CertificateField
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
      <CertificateField
        value={childData.fatherFirstName}
        xPos={200}
        yPos={430}
        width={180}
      />

      {/* Middle */}
      <CertificateField
        value={childData.fatherMiddleName}
        xPos={400}
        yPos={430}
        width={180}
      />

      {/* Last */}
      <CertificateField
        value={childData.fatherLastName}
        xPos={600}
        yPos={430}
        width={190}
      />

      {/* Citizenship */}
      <CertificateField
        value={childData.fatherCitizenship}
        xPos={170}
        yPos={460}
        width={120}
      />

      {/* Religion */}
      <CertificateField
        value={childData.fatherReligion}
        xPos={300}
        yPos={460}
        width={180}
      />

      {/* Occupation */}
      <CertificateField
        value={childData.fatherOccupation}
        xPos={550}
        yPos={460}
        width={130}
      />

      {/* Age */}
      <CertificateField
        value={childData.fatherAge}
        xPos={700}
        yPos={472}
        width={80}
      />

      {/* ====================================== */}
      {/* FATHER RESIDENCE */}
      {/* ====================================== */}

      <CertificateField
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
      <CertificateField
        value={marriageMonth}
        xPos={160}
        yPos={550}
        width={60}
        fontSize={8}
      />

      {/* Day */}
      <CertificateField
        value={marriageDay}
        xPos={220}
        yPos={550}
        width={40}
        fontSize={8}
      />

      {/* Year */}
      <CertificateField
        value={marriageYear}
        xPos={270}
        yPos={550}
        width={60}
        fontSize={8}
      />

      {/* Place */}
      <CertificateField
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
        <CertificateField
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
      <CertificateField
        value={formatTime(childData.attendantCertificationTime)}
        xPos={500}
        yPos={620}
        width={100}
      />

      {/* Attendant Name */}
      <CertificateField
        value={childData.attendantName}
        xPos={200}
        yPos={658}
        width={250}
        fontSize={12}
        minFontSize={6}
      />

      {/* Attendant Address */}
      <CertificateField
        value={childData.attendantAddress}
        xPos={500}
        yPos={640}
        width={280}
        height={20}
        fontSize={12}
        minFontSize={6}
      />

      {/* Position */}
      <CertificateField
        value={childData.attendantPosition}
        xPos={200}
        yPos={680}
        width={220}
        fontSize={12}
        minFontSize={6}
      />

      {/* Certification Date */}
      <CertificateField
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
      <CertificateField
        value={childData.informantName}
        xPos={150}
        yPos={760}
        width={280}
        fontSize={12}
        minFontSize={6}
      />

      {/* Relationship */}
      <CertificateField
        value={childData.informantRelationship}
        xPos={200}
        yPos={775}
        width={200}
        fontSize={12}
        minFontSize={6}
      />

      {/* Address */}
      <CertificateField
        value={childData.informantAddress}
        xPos={110}
        yPos={795}
        width={340}
        height={18}
        fontSize={12}
        minFontSize={5}
      />

      {/* Date */}
      <CertificateField
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
      <CertificateField
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
      <CertificateField
        value={data?.data?.position}
        xPos={560}
        yPos={780}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      {/* Date */}
      <CertificateField
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
