"use client";

import React from "react";
import FormPreviewContainer from "./FormPreviewContainer";

import {
  BirthRegistrationData,
  CertificateUserData,
} from "@/lib/types/birth-registration";

interface BirthCertificatePreviewProps {
  childData: BirthRegistrationData;

  previewMode?: "registration" | "record" | "print";

  preparedBy?: CertificateUserData | null;
  preparedDate?: string | null;

  receivedBy?: CertificateUserData | null;
  receivedDate?: string | null;

  registrar?: CertificateUserData | null;
  registrarDate?: string | null;

  registryNumber?: string | null;
}

/* ============================================================
   CERTIFICATE COORDINATE SYSTEM

   IMPORTANT:
   All coordinates below are based on the original
   birth_form.jpg coordinate system:

   850 × 1100

   DO NOT convert the individual xPos/yPos values.

   Screen:
   - background form + database values

   Print:
   - database values only
   - no background form
   - same coordinate system
   ============================================================ */

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

  const calculateFontSize = () => {
    const scaledFontSize = fontSize * fontScale;
    const scaledMinFontSize = minFontSize * fontScale;

    if (!width || !stringValue) {
      return scaledFontSize;
    }

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

/* ============================================================
   CERTIFICATE DATA OVERLAY

   This component contains ONLY the database values.

   It is shared by:
   - screen preview
   - physical printing

   That means screen and print always use the same coordinates.
   ============================================================ */

interface CertificateOverlayProps extends BirthCertificatePreviewProps {
  fontScale: number;
}

function CertificateOverlay({
  childData,

  preparedBy,
  preparedDate,

  receivedBy,
  receivedDate,

  registrar,
  registrarDate,

  registryNumber,

  fontScale,
}: CertificateOverlayProps) {
  const PreviewField = (props: CertificateFieldProps) => (
    <CertificateField {...props} fontScale={fontScale} />
  );

  /* ============================================================
     HELPERS
     ============================================================ */

  const formatCityName = (cityName?: string) => {
    if (!cityName) return "";

    return cityName.replace(/^City Of\s+/i, "") + " City";
  };

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

  /* ============================================================
     PLACE OF BIRTH
     ============================================================ */

  const placeOfBirth = [
    childData.hospitalName,
    childData.placeOfBirth.barangayName,
    formatCityName(childData.placeOfBirth.cityName),
    childData.placeOfBirth.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  /* ============================================================
     ADDRESSES
     ============================================================ */

  const motherAddress = buildAddress(
    childData.motherHouserOrSt,
    childData.motherResidence,
  );

  const fatherAddress = buildAddress(
    childData.fatherHouseOrSt,
    childData.fatherResidence,
  );

  /* ============================================================
     MARRIAGE PLACE
     ============================================================ */

  const marriagePlace = [
    formatCityName(childData.marriagePlace.cityName),
    childData.marriagePlace.provinceName,
    childData.marriagePlace.provinceName ? "Philippines" : "",
  ]
    .filter(Boolean)
    .join(", ");

  /* ============================================================
     CHILD BIRTH DATE
     ============================================================ */

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

  /* ============================================================
     PARENTS' MARRIAGE DATE
     ============================================================ */

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

  /* ============================================================
     TIME
     ============================================================ */

  const formatTime = (time: string) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":").map(Number);

    const displayHour = hours % 12 || 12;

    return `${displayHour}:${minutes.toString().padStart(2, "0")}`;
  };

  /* ============================================================
     CERTIFICATE DATE
     ============================================================ */

  const formatCertificateDate = (value?: string | null) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* ============================================================
     PREPARED BY
     ============================================================ */

  const preparedByName = preparedBy
    ? [preparedBy.first_name, preparedBy.last_name].filter(Boolean).join(" ")
    : "";

  const formattedPreparedDate = formatCertificateDate(preparedDate);

  /* ============================================================
     RECEIVED BY
     ============================================================ */

  const receivedByName = receivedBy
    ? [receivedBy.first_name, receivedBy.last_name].filter(Boolean).join(" ")
    : "";

  const formattedReceivedDate = formatCertificateDate(receivedDate);

  /* ============================================================
     REGISTRAR
     ============================================================ */

  const registrarName = registrar
    ? [registrar.first_name, registrar.last_name].filter(Boolean).join(" ")
    : "";

  const formattedRegistrarDate = registrarDate
    ? formatCertificateDate(registrarDate)
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  /* ============================================================
     DATA OVERLAY
     ============================================================ */

  return (
    <>
      {/* REGISTRATION ADDRESS */}

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

      <PreviewField value={registryNumber} xPos={600} yPos={120} width={200} />

      {/* CHILD */}

      <PreviewField
        value={childData.childFirstName}
        xPos={180}
        yPos={160}
        width={190}
      />

      <PreviewField
        value={childData.childMiddleName}
        xPos={400}
        yPos={160}
        width={180}
      />

      <PreviewField
        value={childData.childLastName}
        xPos={600}
        yPos={160}
        width={190}
      />

      <PreviewField
        value={childData.gender}
        xPos={150}
        yPos={188}
        width={130}
      />

      <PreviewField value={day} xPos={450} yPos={188} width={70} />

      <PreviewField value={month} xPos={570} yPos={188} width={100} />

      <PreviewField value={year} xPos={700} yPos={188} width={100} />

      {/* PLACE OF BIRTH */}

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

      {/* BIRTH INFORMATION */}

      <PreviewField
        value={childData.typeOfBirth}
        xPos={190}
        yPos={265}
        width={140}
      />

      <PreviewField
        value={childData.multipleBirthOrder}
        xPos={360}
        yPos={265}
        width={150}
      />

      <PreviewField
        value={childData.birthOrder}
        xPos={540}
        yPos={265}
        width={120}
      />

      <PreviewField
        value={childData.weight}
        xPos={690}
        yPos={265}
        width={100}
      />

      {/* MOTHER */}

      <PreviewField
        value={childData.motherFirstName}
        xPos={200}
        yPos={300}
        width={180}
      />

      <PreviewField
        value={childData.motherMiddleName}
        xPos={400}
        yPos={300}
        width={180}
      />

      <PreviewField
        value={childData.motherLastName}
        xPos={600}
        yPos={300}
        width={190}
      />

      <PreviewField
        value={childData.motherCitizenship}
        xPos={200}
        yPos={325}
        width={200}
      />

      <PreviewField
        value={childData.motherReligion}
        xPos={600}
        yPos={325}
        width={180}
      />

      <PreviewField
        value={childData.totalNumOfChildren}
        xPos={120}
        yPos={370}
        width={60}
      />

      <PreviewField
        value={childData.noOfChildrenAlive}
        xPos={200}
        yPos={370}
        width={100}
      />

      <PreviewField
        value={childData.noOfChildrenDead}
        xPos={380}
        yPos={370}
        width={80}
      />

      <PreviewField
        value={childData.motherOccupation}
        xPos={500}
        yPos={367}
        width={150}
      />

      <PreviewField
        value={childData.motherAge}
        xPos={710}
        yPos={367}
        width={70}
      />

      {/* MOTHER RESIDENCE */}

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

      {/* FATHER */}

      <PreviewField
        value={childData.fatherFirstName}
        xPos={200}
        yPos={430}
        width={180}
      />

      <PreviewField
        value={childData.fatherMiddleName}
        xPos={400}
        yPos={430}
        width={180}
      />

      <PreviewField
        value={childData.fatherLastName}
        xPos={600}
        yPos={430}
        width={190}
      />

      <PreviewField
        value={childData.fatherCitizenship}
        xPos={170}
        yPos={470}
        width={120}
      />

      <PreviewField
        value={childData.fatherReligion}
        xPos={300}
        yPos={470}
        width={180}
      />

      <PreviewField
        value={childData.fatherOccupation}
        xPos={530}
        yPos={470}
        width={130}
      />

      <PreviewField
        value={childData.fatherAge}
        xPos={700}
        yPos={472}
        width={80}
      />

      {/* FATHER RESIDENCE */}

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

      {/* MARRIAGE */}

      <PreviewField value={marriageMonth} xPos={140} yPos={550} width={70} />

      <PreviewField value={marriageDay} xPos={220} yPos={550} width={40} />

      <PreviewField value={marriageYear} xPos={270} yPos={550} width={60} />

      <PreviewField value={marriagePlace} xPos={350} yPos={550} width={440} />

      {/* ATTENDANT */}

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

      <PreviewField
        value={formatTime(childData.attendantCertificationTime)}
        xPos={500}
        yPos={620}
        width={100}
      />

      <PreviewField
        value={childData.attendantName}
        xPos={180}
        yPos={662}
        width={250}
      />

      <PreviewField
        value={childData.attendantAddress}
        xPos={500}
        yPos={635}
        width={280}
        height={40}
      />

      <PreviewField
        value={childData.attendantPosition}
        xPos={200}
        yPos={680}
        width={220}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={childData.attendantCertificationDate}
        xPos={500}
        yPos={680}
        width={200}
        fontSize={12}
      />

      {/* INFORMANT */}

      <PreviewField
        value={childData.informantName}
        xPos={150}
        yPos={760}
        width={280}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={childData.informantRelationship}
        xPos={200}
        yPos={775}
        width={200}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={childData.informantAddress}
        xPos={110}
        yPos={795}
        width={340}
        height={18}
      />

      <PreviewField
        value={childData.informantDate}
        xPos={100}
        yPos={810}
        width={200}
        fontSize={12}
      />

      {/* PREPARED BY */}

      <PreviewField
        value={preparedByName}
        xPos={560}
        yPos={760}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={preparedBy?.position ?? ""}
        xPos={560}
        yPos={780}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={formattedPreparedDate}
        xPos={510}
        yPos={800}
        width={280}
        fontSize={12}
        minFontSize={6}
      />

      {/* RECEIVED BY */}

      <PreviewField
        value={receivedByName}
        xPos={180}
        yPos={860}
        width={250}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={receivedBy?.position ?? ""}
        xPos={180}
        yPos={880}
        width={250}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={formattedReceivedDate}
        xPos={150}
        yPos={900}
        width={280}
        fontSize={12}
        minFontSize={6}
      />

      {/* REGISTRAR */}

      <PreviewField
        value={registrarName}
        xPos={560}
        yPos={860}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={registrar?.position ?? ""}
        xPos={560}
        yPos={880}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={formattedRegistrarDate}
        xPos={510}
        yPos={900}
        width={280}
        fontSize={12}
        minFontSize={6}
      />
    </>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function BirthCertificatePreview({
  childData,

  previewMode = "registration",

  preparedBy,
  preparedDate,

  receivedBy,
  receivedDate,

  registrar,
  registrarDate,

  registryNumber,
}: BirthCertificatePreviewProps) {
  /*
   * Record mode is intentionally easier to read.
   *
   * Print uses the original font scale because it must
   * match the physical form.
   */
  const fontScale = previewMode === "record" ? 16 / 12 : 1;

  const overlayProps = {
    childData,

    preparedBy,
    preparedDate,

    receivedBy,
    receivedDate,

    registrar,
    registrarDate,

    registryNumber,

    fontScale,
  };

  /* ============================================================
     PRINT MODE

     IMPORTANT:
     NO birth_form.jpg here.

     The office already has the physical Form 102.
     Only database values are sent to the printer.
     ============================================================ */

  if (previewMode === "print") {
    return (
      <div
        className="birth-certificate-print-overlay"
        data-preview-mode="print"
      >
        <CertificateOverlay {...overlayProps} />

        <style jsx global>{`
          @media print {
            .birth-certificate-print-overlay {
              position: relative !important;

              /*
               * Coordinate canvas.
               *
               * The physical sizing/scaling is controlled
               * by the outer .birth-print-sheet.
               */
              width: 100% !important;
              height: 100% !important;

              margin: 0 !important;
              padding: 0 !important;

              border: 0 !important;
              box-shadow: none !important;

              overflow: visible !important;

              background: transparent !important;

              transform: none !important;
            }

            .birth-certificate-print-overlay .birth-font {
              color: #000 !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
          }
        `}</style>
      </div>
    );
  }

  /* ============================================================
     SCREEN PREVIEW

     Keep the actual Form 102 background inside the application.
     ============================================================ */

  return (
    <div className="birth-certificate-preview" data-preview-mode={previewMode}>
      <FormPreviewContainer imageSrc="/assets/birth_form.jpg">
        <CertificateOverlay {...overlayProps} />
      </FormPreviewContainer>

      <style jsx global>{`
        /*
         * SCREEN ONLY.
         *
         * Do NOT put physical print dimensions here.
         * Printing is controlled by the page/global print CSS.
         */

        .birth-certificate-preview {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
