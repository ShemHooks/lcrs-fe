import FormPreviewContainer from "./FormPreviewContainer";
import { BirthRegistrationData } from "@/lib/types/birth-registration";
import { X } from "lucide-react";
import { getProfile } from "@/server/hooks/authHooks";

interface BirthCertificatePreviewProps {
  childData: BirthRegistrationData;
}

export default function BirthCertificatePreview({
  childData,
}: BirthCertificatePreviewProps) {
  function formatCityName(cityName?: string) {
    if (!cityName) return "";

    return cityName.replace(/^City Of\s+/i, "") + " City";
  }

  const birthDate = childData.childBirthDate
    ? new Date(childData.childBirthDate)
    : null;

  const isValidDate = birthDate && !isNaN(birthDate.getTime());

  const day = isValidDate ? birthDate.getDate() : "";
  const month = isValidDate
    ? birthDate.toLocaleString("en-US", { month: "long" })
    : "";
  const year = isValidDate ? birthDate.getFullYear() : "";

  const x = (value: number) => `${(value / 850) * 100}%`;
  const y = (value: number) => `${(value / 1100) * 100}%`;

  const parentMarraigeDate = childData.marriageDate
    ? new Date(childData.marriageDate)
    : null;

  const isValidMarraigeDate =
    parentMarraigeDate && !isNaN(parentMarraigeDate.getTime());

  const marraigeDay = isValidMarraigeDate ? parentMarraigeDate.getDate() : "";
  const marraigeMonth = isValidMarraigeDate
    ? parentMarraigeDate.toLocaleDateString("en-US", { month: "long" })
    : "";
  const marraigeYear = isValidMarraigeDate
    ? parentMarraigeDate.getFullYear()
    : "";

  const formatTime = (time: string) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":").map(Number);

    const displayHour = hours % 12 || 12;

    return `${displayHour}:${minutes.toString().padStart(2, "0")}`;
  };

  const { data, isLoading, isError, error } = getProfile();

  const today = new Date();

  const formattedToday = today.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <FormPreviewContainer imageSrc="/assets/birth_form.jpg">
      {/* Province */}
      <span
        className="absolute text-[10px] birth-font "
        style={{
          top: y(100),
          left: x(150),
        }}
      >
        {childData.address.provinceName}
      </span>
      {/* City */}
      <span
        className="absolute text-[10px] birth-font "
        style={{
          top: y(120),
          left: x(190),
        }}
      >
        {formatCityName(childData.address.cityName)}
      </span>
      {/* First Name */}
      <span
        className="absolute birth-font text-[10px]"
        style={{
          top: y(148),
          left: x(180),
        }}
      >
        {childData.childFirstName}
      </span>

      {/* Middle Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(148),
          left: x(400),
        }}
      >
        {childData.childMiddleName}
      </span>

      {/* Last Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(148),
          left: x(600),
        }}
      >
        {childData.childLastName}
      </span>

      {/* Gender */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(178),
          left: x(150),
        }}
      >
        {childData.gender}
      </span>

      {/* Date of Birth */}
      {/* Day */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(178),
          left: x(450),
        }}
      >
        {day}
      </span>

      {/* Month */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(178),
          left: x(570),
        }}
      >
        {month}
      </span>

      {/* Year */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(178),
          left: x(700),
        }}
      >
        {year}
      </span>

      {/* place of birth */}
      <div
        className="absolute flex gap-2 text-[10px] birth-font"
        style={{
          top: y(220),
          left: x(90),
        }}
      >
        <span>{childData.hospitalName},</span>
        {childData.placeOfBirth.barangayName && (
          <span>{childData.placeOfBirth.barangayName},</span>
        )}
        <span>{formatCityName(childData.placeOfBirth.cityName)},</span>

        <span>{childData.placeOfBirth.provinceName}</span>
      </div>

      {/* type of birth */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(260),
          left: x(190),
        }}
      >
        {childData.typeOfBirth}
      </span>

      {/* If multiple */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(260),
          left: x(360),
        }}
      >
        {childData.multipleBirthOrder}
      </span>

      {/* birth order*/}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(260),
          left: x(540),
        }}
      >
        {childData.birthOrder}
      </span>

      {/* weight at birth */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(260),
          left: x(690),
        }}
      >
        {childData.weight}
      </span>

      {/* MOther */}

      {/* Mother F Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(290),
          left: x(200),
        }}
      >
        {childData.motherFirstName}
      </span>

      {/* Mother M Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(290),
          left: x(400),
        }}
      >
        {childData.motherMiddleName}
      </span>
      {/* Mother L Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(290),
          left: x(600),
        }}
      >
        {childData.motherLastName}
      </span>

      {/* Mother Citizenship */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(320),
          left: x(200),
        }}
      >
        {childData.motherCitizenship}
      </span>
      {/* Mother Religion */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(320),
          left: x(600),
        }}
      >
        {childData.motherReligion}
      </span>
      {/* Total of born alive */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(370),
          left: x(120),
        }}
      >
        {childData.totalNumOfChildren}
      </span>
      {/* Number of children still living */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(370),
          left: x(200),
        }}
      >
        {childData.noOfChildrenAlive}
      </span>
      {/* number of dead children */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(370),
          left: x(380),
        }}
      >
        {childData.noOfChildrenDead}
      </span>
      {/* Occupation */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(367),
          left: x(500),
        }}
      >
        {childData.motherOccupation}
      </span>
      {/* Mother Age */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(367),
          left: x(710),
        }}
      >
        {childData.motherAge}
      </span>
      {/* mother residence */}
      <div
        className="absolute flex gap-2 text-[10px] birth-font"
        style={{
          top: y(400),
          left: x(80),
        }}
      >
        <span>{childData.motherHouserOrSt},</span>
        {childData.motherResidence.barangayName && (
          <span>{childData.motherResidence.barangayName},</span>
        )}
        <span>{formatCityName(childData.motherResidence.cityName)},</span>

        <span>{childData.motherResidence.provinceName}</span>

        {childData.motherResidence.provinceName && <span>Philipines</span>}
      </div>

      {/* Father */}

      {/* Father F Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(430),
          left: x(200),
        }}
      >
        {childData.fatherFirstName}
      </span>

      {/* Father M Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(430),
          left: x(400),
        }}
      >
        {childData.fatherMiddleName}
      </span>
      {/* father L Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(430),
          left: x(600),
        }}
      >
        {childData.fatherLastName}
      </span>

      {/* Father Citizenship */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(460),
          left: x(170),
        }}
      >
        {childData.fatherCitizenship}
      </span>
      {/* Father Religion */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(460),
          left: x(300),
        }}
      >
        {childData.fatherReligion}
      </span>

      {/* Father Occupation */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(460),
          left: x(550),
        }}
      >
        {childData.fatherOccupation}
      </span>

      {/* Father Age */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(472),
          left: x(700),
        }}
      >
        {childData.fatherAge}
      </span>

      {/* father residence */}
      <div
        className="absolute flex gap-2 text-[10px] birth-font"
        style={{
          top: y(500),
          left: x(80),
        }}
      >
        <span>{childData.fatherHouseOrSt},</span>
        {childData.fatherResidence.barangayName && (
          <span>{childData.fatherResidence.barangayName},</span>
        )}
        <span>{formatCityName(childData.fatherResidence.cityName)},</span>

        <span>{childData.fatherResidence.provinceName}</span>

        {childData.fatherResidence.provinceName && <span>Philipines</span>}
      </div>

      {/* marraige */}

      {/* Date of Marraige */}

      {/* Month */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(550),
          left: x(160),
        }}
      >
        {marraigeMonth}
      </span>

      {/* Day */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(550),
          left: x(220),
        }}
      >
        {marraigeDay}
      </span>

      {/* Year */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(550),
          left: x(270),
        }}
      >
        {marraigeYear}
      </span>

      {/* place of marraige */}
      <div
        className="absolute flex gap-2 text-[10px] birth-font"
        style={{
          top: y(550),
          left: x(350),
        }}
      >
        <span>{formatCityName(childData.marriagePlace.cityName)},</span>

        <span>{childData.marriagePlace.provinceName}</span>
        {childData.marriagePlace.provinceName && <span>Philipines</span>}
      </div>

      {/* attendant */}

      {/* time */}

      {/* Attendant Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(620),
          left: x(500),
        }}
      >
        {formatTime(childData.attendantCertificationTime)}
      </span>

      {/* type */}
      <span
        className="absolute text-[10px]  font-extrabold"
        style={{
          fontFamily: "Courier New, monospace",
          top: y(590),

          left:
            childData.attendantType === "Physician"
              ? x(70)
              : childData.attendantType === "Nurse"
                ? x(180)
                : childData.attendantType === "Midwife"
                  ? x(270)
                  : childData.attendantType === "Hilot"
                    ? x(370)
                    : childData.attendantType === "Others"
                      ? x(580)
                      : x(0),
        }}
      >
        {childData.attendantType && <span>x</span>}
      </span>
      {/* Attendant Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(658),
          left: x(200),
        }}
      >
        {childData.attendantName}
      </span>

      {/* Attendant Address */}
      <span
        className="absolute text-[10px] birth-font whitespace-normal leading-3"
        style={{
          top: y(640),
          left: x(500),
          width: x(180), // width of the address field
        }}
      >
        {childData.attendantAddress}
      </span>

      {/* Attendant Position */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(680),
          left: x(200),
        }}
      >
        {childData.attendantPosition}
      </span>

      {/* Attendant Signed Date */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(680),
          left: x(500),
        }}
      >
        {childData.attendantCertificationDate}
      </span>

      {/* Infromant */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(760),
          left: x(150),
        }}
      >
        {childData.informantName}
      </span>
      {/* informant relationship */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(775),
          left: x(200),
        }}
      >
        {childData.informantRelationship}
      </span>
      {/* informat address */}
      <span
        className="absolute text-[8px] birth-font"
        style={{
          top: y(795),
          left: x(110),
        }}
      >
        {childData.informantAddress}
      </span>

      {/* informant signature data */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(810),
          left: x(100),
        }}
      >
        {childData.informantDate}
      </span>

      {/* prepared by */}
      {/* Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(760),
          left: x(560),
        }}
      >
        {data?.data?.first_name} {data?.data?.last_name}
      </span>
      {/* Posistion */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(780),
          left: x(560),
        }}
      >
        {data?.data?.position}
      </span>
      {/* date */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(800),
          left: x(510),
        }}
      >
        {formattedToday}
      </span>
    </FormPreviewContainer>
  );
}
