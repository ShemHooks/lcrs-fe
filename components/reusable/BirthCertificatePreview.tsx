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

   Original birth_form.jpg:
   850 × 1100

   IMPORTANT:
   - Screen preview uses original coordinates.
   - Print mode can use separate xPrintPos / yPrintPos coordinates.
   - If print coordinates are omitted, xPos / yPos are used as fallback.
   ============================================================ */

const CERTIFICATE_WIDTH = 850;
const CERTIFICATE_HEIGHT = 1100;

// Physical print canvas: 8.5 × 13 inches.
// Using 850 × 1300 keeps the same calibration unit:
// 100 coordinate units = 1 physical inch.
const PRINT_CERTIFICATE_WIDTH = 850;
const PRINT_CERTIFICATE_HEIGHT = 1300;

const x = (value: number) => `${(value / CERTIFICATE_WIDTH) * 100}%`;
const y = (value: number) => `${(value / CERTIFICATE_HEIGHT) * 100}%`;

const printX = (value: number) => `${(value / PRINT_CERTIFICATE_WIDTH) * 100}%`;

const printY = (value: number) =>
  `${(value / PRINT_CERTIFICATE_HEIGHT) * 100}%`;

/* ============================================================
   PHYSICAL PRINT CALIBRATION

   All certificate fields below now define physical print coordinates.

   Global OFFSET values remain available to move the entire
   printed overlay after individual fields have been calibrated.

   PRINT_OFFSET_Y = -10 moves ALL printed fields upward.
   PRINT_OFFSET_X = 5 moves ALL printed fields to the right.

   These values use the original 850 × 1100 coordinate system.
   ============================================================ */

const PRINT_OFFSET_X = 0;
const PRINT_OFFSET_Y = 0;

/* ============================================================
   FIELD
   ============================================================ */

interface CertificateFieldProps {
  value?: React.ReactNode;

  xPos: number;
  yPos: number;

  // Optional coordinates used only when printing.
  // If omitted, print mode falls back to xPos / yPos.
  xPrintPos?: number;
  yPrintPos?: number;

  width?: number;
  height?: number;

  fontSize?: number;
  minFontSize?: number;
  fontScale?: number;

  center?: boolean;
  bold?: boolean;

  className?: string;

  isPrint?: boolean;
}

const CertificateField = ({
  value,

  xPos,
  yPos,

  xPrintPos,
  yPrintPos,

  width,
  height = 20,

  fontSize = 12,
  minFontSize = 6,
  fontScale = 1,

  center = false,
  bold = false,

  className = "",

  isPrint = false,
}: CertificateFieldProps) => {
  const stringValue =
    typeof value === "string" || typeof value === "number" ? String(value) : "";

  /* ========================================================
     FONT SIZE
     ======================================================== */

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

  /* ========================================================
     PRINT COORDINATE CALIBRATION
     ======================================================== */

  const finalX = isPrint ? (xPrintPos ?? xPos) + PRINT_OFFSET_X : xPos;

  const finalY = isPrint ? (yPrintPos ?? yPos) + PRINT_OFFSET_Y : yPos;

  /*
   * Width/height stay based on the original coordinate
   * system for now. We only calibrate field positions.
   */
  const finalWidth = width;
  const finalHeight = height;

  return (
    <span
      className={`absolute birth-font ${className}`}
      title={stringValue || undefined}
      style={{
        top: isPrint ? printY(finalY) : y(finalY),
        left: isPrint ? printX(finalX) : x(finalX),

        ...(finalWidth
          ? {
              width: isPrint ? printX(finalWidth) : x(finalWidth),
            }
          : {}),

        ...(finalHeight
          ? {
              height: isPrint ? printY(finalHeight) : y(finalHeight),
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

   Screen:
   Original coordinates.

   Print:
   Same fields, using xPrintPos / yPrintPos when provided.
   Otherwise the normal xPos / yPos coordinates are used.
   ============================================================ */

interface CertificateOverlayProps extends BirthCertificatePreviewProps {
  fontScale: number;
  isPrint?: boolean;
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
  isPrint = false,
}: CertificateOverlayProps) {
  const PreviewField = (props: CertificateFieldProps) => (
    <CertificateField {...props} fontScale={fontScale} isPrint={isPrint} />
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
      {/* ====================================================== */}
      {/* REGISTRATION ADDRESS */}
      {/* ====================================================== */}

      <PreviewField
        value={childData.address.provinceName}
        xPos={150}
        yPos={100}
        xPrintPos={180}
        yPrintPos={135}
        width={450}
      />

      <PreviewField
        value={formatCityName(childData.address.cityName)}
        xPos={190}
        yPos={120}
        xPrintPos={200}
        yPrintPos={150}
        width={400}
      />

      <PreviewField
        value={registryNumber}
        xPos={600}
        yPos={120}
        yPrintPos={150}
        xPrintPos={700}
        width={200}
      />

      {/* ====================================================== */}
      {/* CHILD */}
      {/* ====================================================== */}

      <PreviewField
        value={childData.childFirstName}
        xPos={180}
        yPos={160}
        xPrintPos={175}
        yPrintPos={190}
        width={190}
      />

      <PreviewField
        value={childData.childMiddleName}
        xPos={400}
        yPos={160}
        xPrintPos={420}
        yPrintPos={190}
        width={180}
      />

      <PreviewField
        value={childData.childLastName}
        xPos={600}
        yPos={160}
        xPrintPos={640}
        yPrintPos={190}
        width={190}
      />

      <PreviewField
        value={childData.gender}
        xPos={150}
        yPos={188}
        xPrintPos={150}
        yPrintPos={230}
        width={130}
      />

      <PreviewField
        value={day}
        xPos={450}
        yPos={188}
        yPrintPos={230}
        xPrintPos={465}
        width={70}
      />

      <PreviewField
        value={month}
        xPos={570}
        yPos={188}
        yPrintPos={230}
        xPrintPos={590}
        width={100}
      />

      <PreviewField
        value={year}
        xPos={700}
        yPos={188}
        yPrintPos={230}
        xPrintPos={740}
        width={100}
      />

      {/* ====================================================== */}
      {/* PLACE OF BIRTH */}
      {/* ====================================================== */}

      <PreviewField
        value={placeOfBirth}
        xPos={90}
        yPos={220}
        yPrintPos={280}
        xPrintPos={140}
        width={700}
        height={22}
        fontSize={12}
        minFontSize={6}
        bold
      />

      {/* ====================================================== */}
      {/* BIRTH INFORMATION */}
      {/* ====================================================== */}

      <PreviewField
        value={childData.typeOfBirth}
        xPos={190}
        yPos={265}
        yPrintPos={335}
        xPrintPos={180}
        width={140}
      />

      <PreviewField
        value={childData.multipleBirthOrder}
        xPos={360}
        yPos={265}
        yPrintPos={335}
        xPrintPos={360}
        width={150}
      />

      <PreviewField
        value={childData.birthOrder}
        xPos={540}
        yPos={265}
        yPrintPos={335}
        xPrintPos={600}
        width={120}
      />

      <PreviewField
        value={childData.weight}
        xPos={690}
        yPos={265}
        yPrintPos={335}
        xPrintPos={735}
        width={100}
      />

      {/* ====================================================== */}
      {/* MOTHER */}
      {/* ====================================================== */}

      <PreviewField
        value={childData.motherFirstName}
        xPos={200}
        yPos={300}
        yPrintPos={370}
        xPrintPos={190}
        width={180}
      />

      <PreviewField
        value={childData.motherMiddleName}
        xPos={400}
        yPos={300}
        yPrintPos={370}
        xPrintPos={410}
        width={180}
      />

      <PreviewField
        value={childData.motherLastName}
        xPos={600}
        yPos={300}
        yPrintPos={370}
        xPrintPos={685}
        width={190}
      />

      <PreviewField
        value={childData.motherCitizenship}
        xPos={200}
        yPos={325}
        yPrintPos={415}
        xPrintPos={200}
        width={200}
      />

      <PreviewField
        value={childData.motherReligion}
        xPos={600}
        yPos={325}
        yPrintPos={415}
        xPrintPos={600}
        width={180}
      />

      <PreviewField
        value={childData.totalNumOfChildren}
        xPos={120}
        yPos={370}
        yPrintPos={460}
        xPrintPos={120}
        width={60}
      />

      <PreviewField
        value={childData.noOfChildrenAlive}
        xPos={200}
        yPos={370}
        yPrintPos={460}
        xPrintPos={250}
        width={100}
      />

      <PreviewField
        value={childData.noOfChildrenDead}
        xPos={380}
        yPos={370}
        yPrintPos={460}
        xPrintPos={380}
        width={80}
      />

      <PreviewField
        value={childData.motherOccupation}
        xPos={500}
        yPos={367}
        yPrintPos={460}
        xPrintPos={510}
        width={150}
      />

      <PreviewField
        value={childData.motherAge}
        xPos={710}
        yPos={367}
        yPrintPos={460}
        xPrintPos={760}
        width={70}
      />

      {/* ====================================================== */}
      {/* MOTHER RESIDENCE */}
      {/* ====================================================== */}

      <PreviewField
        value={motherAddress}
        xPos={80}
        yPos={400}
        yPrintPos={500}
        xPrintPos={200}
        width={720}
        height={21}
        fontSize={12}
        minFontSize={6}
        bold
      />

      {/* ====================================================== */}
      {/* FATHER */}
      {/* ====================================================== */}

      <PreviewField
        value={childData.fatherFirstName}
        xPos={200}
        yPos={430}
        yPrintPos={541}
        xPrintPos={170}
        width={180}
      />

      <PreviewField
        value={childData.fatherMiddleName}
        xPos={400}
        yPos={430}
        yPrintPos={541}
        xPrintPos={405}
        width={180}
      />

      <PreviewField
        value={childData.fatherLastName}
        xPos={600}
        yPos={430}
        yPrintPos={541}
        xPrintPos={690}
        width={190}
      />

      <PreviewField
        value={childData.fatherCitizenship}
        xPos={170}
        yPos={470}
        yPrintPos={590}
        xPrintPos={170}
        width={120}
      />

      <PreviewField
        value={childData.fatherReligion}
        xPos={300}
        yPos={470}
        yPrintPos={590}
        xPrintPos={300}
        width={180}
      />

      <PreviewField
        value={childData.fatherOccupation}
        xPos={530}
        yPos={470}
        yPrintPos={590}
        xPrintPos={550}
        width={130}
      />

      <PreviewField
        value={childData.fatherAge}
        xPos={700}
        yPos={472}
        yPrintPos={590}
        xPrintPos={760}
        width={80}
      />

      {/* ====================================================== */}
      {/* FATHER RESIDENCE */}
      {/* ====================================================== */}

      <PreviewField
        value={fatherAddress}
        xPos={80}
        yPos={500}
        yPrintPos={637}
        xPrintPos={140}
        width={720}
        height={21}
        fontSize={12}
        minFontSize={6}
        bold
      />

      {/* ====================================================== */}
      {/* MARRIAGE */}
      {/* ====================================================== */}

      <PreviewField
        value={marriageMonth}
        xPos={140}
        yPos={550}
        yPrintPos={695}
        xPrintPos={140}
        width={70}
      />

      <PreviewField
        value={marriageDay}
        xPos={220}
        yPos={550}
        yPrintPos={695}
        xPrintPos={220}
        width={40}
      />

      <PreviewField
        value={marriageYear}
        xPos={270}
        yPos={550}
        yPrintPos={695}
        xPrintPos={270}
        width={60}
      />

      <PreviewField
        value={marriagePlace}
        xPos={350}
        yPos={550}
        yPrintPos={695}
        xPrintPos={370}
        width={440}
      />

      {/* ====================================================== */}
      {/* ATTENDANT */}
      {/* ====================================================== */}

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
          xPrintPos={
            childData.attendantType === "Physician"
              ? 90
              : childData.attendantType === "Nurse"
                ? 200
                : childData.attendantType === "Midwife"
                  ? 290
                  : childData.attendantType === "Hilot"
                    ? 390
                    : childData.attendantType === "Others"
                      ? 600
                      : 0
          }
          yPos={590}
          yPrintPos={745}
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
        yPrintPos={788}
        xPrintPos={520}
        width={100}
      />

      <PreviewField
        value={childData.attendantName}
        xPos={180}
        yPos={662}
        yPrintPos={844}
        xPrintPos={180}
        width={250}
      />

      <PreviewField
        value={childData.attendantAddress}
        xPos={500}
        yPos={635}
        yPrintPos={805}
        xPrintPos={510}
        width={280}
        height={40}
      />

      <PreviewField
        value={childData.attendantPosition}
        xPos={200}
        yPos={680}
        yPrintPos={868}
        xPrintPos={200}
        width={220}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={childData.attendantCertificationDate}
        xPos={500}
        yPos={680}
        yPrintPos={868}
        xPrintPos={505}
        width={200}
        fontSize={12}
      />

      {/* ====================================================== */}
      {/* INFORMANT */}
      {/* ====================================================== */}

      <PreviewField
        value={childData.informantName}
        xPos={150}
        yPos={760}
        yPrintPos={960}
        xPrintPos={170}
        width={280}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={childData.informantRelationship}
        xPos={200}
        yPos={775}
        yPrintPos={984}
        xPrintPos={220}
        width={200}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={childData.informantAddress}
        xPos={110}
        yPos={795}
        yPrintPos={1012}
        xPrintPos={130}
        width={340}
        height={18}
      />

      <PreviewField
        value={childData.informantDate}
        xPos={100}
        yPos={810}
        yPrintPos={1030}
        xPrintPos={120}
        width={200}
        fontSize={12}
      />

      {/* ====================================================== */}
      {/* PREPARED BY */}
      {/* ====================================================== */}

      <PreviewField
        value={preparedByName}
        xPos={560}
        yPos={760}
        yPrintPos={960}
        xPrintPos={560}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={preparedBy?.position ?? ""}
        xPos={560}
        yPos={780}
        yPrintPos={984}
        xPrintPos={560}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={formattedPreparedDate}
        xPos={510}
        yPos={800}
        yPrintPos={1008}
        xPrintPos={510}
        width={280}
        fontSize={12}
        minFontSize={6}
      />

      {/* ====================================================== */}
      {/* RECEIVED BY */}
      {/* ====================================================== */}

      <PreviewField
        value={receivedByName}
        xPos={180}
        yPos={860}
        yPrintPos={1089}
        xPrintPos={180}
        width={250}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={receivedBy?.position ?? ""}
        xPos={180}
        yPos={880}
        yPrintPos={1113}
        xPrintPos={180}
        width={250}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={formattedReceivedDate}
        xPos={150}
        yPos={900}
        yPrintPos={1137}
        xPrintPos={150}
        width={280}
        fontSize={12}
        minFontSize={6}
      />

      {/* ====================================================== */}
      {/* REGISTRAR */}
      {/* ====================================================== */}

      <PreviewField
        value={registrarName}
        xPos={560}
        yPos={860}
        yPrintPos={1089}
        xPrintPos={560}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={registrar?.position ?? ""}
        xPos={560}
        yPos={880}
        yPrintPos={1113}
        xPrintPos={560}
        width={230}
        fontSize={12}
        minFontSize={6}
      />

      <PreviewField
        value={formattedRegistrarDate}
        xPos={510}
        yPos={900}
        yPrintPos={1137}
        xPrintPos={510}
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
   * Record mode is intentionally larger/easier to read.
   *
   * Print uses original font size because it needs to line up
   * with the physical Form 102.
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

    /*
     * IMPORTANT:
     * Physical calibration is applied ONLY in print mode.
     */
    isPrint: previewMode === "print",
  };

  /* ============================================================
     PRINT MODE

     No birth_form.jpg.
     Only database values are printed onto the physical Form 102.
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
            /*
             * IMPORTANT:
             * Form 102 is being printed on the configured 8.5 × 13 sheet.
             * Override the old 11-inch .birth-print-sheet child height so
             * yPrintPos values above 1100 are not clipped.
             */
            .birth-print-sheet {
              width: 8.5in !important;
              height: 13in !important;
              min-height: 13in !important;
              max-height: 13in !important;
              overflow: visible !important;
            }

            .birth-print-sheet > .birth-certificate-print-overlay,
            .birth-certificate-print-overlay {
              position: relative !important;

              width: 8.5in !important;
              height: 13in !important;
              min-width: 8.5in !important;
              min-height: 13in !important;
              max-width: 8.5in !important;
              max-height: 13in !important;

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

     The scanned Form 102 remains visible here.
     Print calibration does NOT affect this preview.
     ============================================================ */

  return (
    <div className="birth-certificate-preview" data-preview-mode={previewMode}>
      <FormPreviewContainer imageSrc="/assets/birth_form.jpg">
        <CertificateOverlay {...overlayProps} />
      </FormPreviewContainer>

      <style jsx global>{`
        .birth-certificate-preview {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
