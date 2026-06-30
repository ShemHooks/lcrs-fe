import FormPreviewContainer from "./FormPreviewContainer";
import { BirthRegistrationData } from "@/lib/types/birth-registration";
import { X } from "lucide-react";

interface BirthCertificatePreviewProps {
  data: BirthRegistrationData;
}

export default function BirthCertificatePreview({
  data,
}: BirthCertificatePreviewProps) {
  function formatCityName(cityName?: string) {
    if (!cityName) return "";

    return cityName.replace(/^City Of\s+/i, "") + " City";
  }

  const birthDate = data.birthDate ? new Date(data.birthDate) : null;

  const isValidDate = birthDate && !isNaN(birthDate.getTime());

  const day = isValidDate ? birthDate.getDate() : "";
  const month = isValidDate
    ? birthDate.toLocaleString("en-US", { month: "long" })
    : "";
  const year = isValidDate ? birthDate.getFullYear() : "";

  const x = (value: number) => `${(value / 850) * 100}%`;
  const y = (value: number) => `${(value / 1100) * 100}%`;

  const parentMarraigeDate = data.marriageDate
    ? new Date(data.marriageDate)
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
        {data.address.provinceName}
      </span>
      {/* City */}
      <span
        className="absolute text-[10px] birth-font "
        style={{
          top: y(120),
          left: x(190),
        }}
      >
        {formatCityName(data.address.cityName)}
      </span>
      {/* First Name */}
      <span
        className="absolute birth-font text-[10px]"
        style={{
          top: y(148),
          left: x(180),
        }}
      >
        {data.childFirstName}
      </span>

      {/* Middle Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(148),
          left: x(400),
        }}
      >
        {data.childMiddleName}
      </span>

      {/* Last Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(148),
          left: x(600),
        }}
      >
        {data.childLastName}
      </span>

      {/* Gender */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(178),
          left: x(150),
        }}
      >
        {data.gender}
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
        <span>{data.hospitalName},</span>
        {data.placeOfBirth.barangayName && (
          <span>{data.placeOfBirth.barangayName},</span>
        )}
        <span>{formatCityName(data.placeOfBirth.cityName)},</span>

        <span>{data.placeOfBirth.provinceName}</span>
      </div>

      {/* type of birth */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(260),
          left: x(190),
        }}
      >
        {data.typeOfBirth}
      </span>

      {/* If multiple */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(260),
          left: x(360),
        }}
      >
        {data.multipleBirthOrder}
      </span>

      {/* birth order*/}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(260),
          left: x(540),
        }}
      >
        {data.birthOrder}
      </span>

      {/* weight at birth */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(260),
          left: x(690),
        }}
      >
        {data.weight}
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
        {data.motherFirstName}
      </span>

      {/* Mother M Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(290),
          left: x(400),
        }}
      >
        {data.motherMiddleName}
      </span>
      {/* Mother L Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(290),
          left: x(600),
        }}
      >
        {data.motherLastName}
      </span>

      {/* Mother Citizenship */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(320),
          left: x(200),
        }}
      >
        {data.motherCitizenship}
      </span>
      {/* Mother Religion */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(320),
          left: x(600),
        }}
      >
        {data.motherReligion}
      </span>
      {/* Total of born alive */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(370),
          left: x(120),
        }}
      >
        {data.totalNumOfChildren}
      </span>
      {/* Number of children still living */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(370),
          left: x(200),
        }}
      >
        {data.noOfChildrenAlive}
      </span>
      {/* number of dead children */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(370),
          left: x(380),
        }}
      >
        {data.noOfChildrenDead}
      </span>
      {/* Occupation */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(367),
          left: x(500),
        }}
      >
        {data.motherOccupation}
      </span>
      {/* Mother Age */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(367),
          left: x(710),
        }}
      >
        {data.motherAge}
      </span>
      {/* mother residence */}
      <div
        className="absolute flex gap-2 text-[10px] birth-font"
        style={{
          top: y(400),
          left: x(80),
        }}
      >
        <span>{data.motherHouserOrSt},</span>
        {data.motherResidence.barangayName && (
          <span>{data.motherResidence.barangayName},</span>
        )}
        <span>{formatCityName(data.motherResidence.cityName)},</span>

        <span>{data.motherResidence.provinceName}</span>

        {data.motherResidence.provinceName && <span>Philipines</span>}
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
        {data.fatherFirstName}
      </span>

      {/* Father M Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(430),
          left: x(400),
        }}
      >
        {data.fatherMiddleName}
      </span>
      {/* father L Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(430),
          left: x(600),
        }}
      >
        {data.fatherLastName}
      </span>

      {/* Father Citizenship */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(460),
          left: x(170),
        }}
      >
        {data.fatherCitizenship}
      </span>
      {/* Father Religion */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(460),
          left: x(300),
        }}
      >
        {data.fatherReligion}
      </span>

      {/* Father Occupation */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(460),
          left: x(550),
        }}
      >
        {data.fatherOccupation}
      </span>

      {/* Father Age */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(472),
          left: x(700),
        }}
      >
        {data.fatherAge}
      </span>

      {/* father residence */}
      <div
        className="absolute flex gap-2 text-[10px] birth-font"
        style={{
          top: y(500),
          left: x(80),
        }}
      >
        <span>{data.fatherHouseOrSt},</span>
        {data.fatherResidence.barangayName && (
          <span>{data.fatherResidence.barangayName},</span>
        )}
        <span>{formatCityName(data.fatherResidence.cityName)},</span>

        <span>{data.fatherResidence.provinceName}</span>

        {data.fatherResidence.provinceName && <span>Philipines</span>}
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
        <span>{formatCityName(data.marriagePlace.cityName)},</span>

        <span>{data.marriagePlace.provinceName}</span>
        {data.marriagePlace.provinceName && <span>Philipines</span>}
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
        {formatTime(data.attendantCertificationTime)}
      </span>

      {/* type */}
      <span
        className="absolute text-[10px]  font-extrabold"
        style={{
          fontFamily: "Courier New, monospace",
          top: y(590),

          left:
            data.attendantType === "Physician"
              ? x(70)
              : data.attendantType === "Nurse"
                ? x(180)
                : data.attendantType === "Midwife"
                  ? x(270)
                  : data.attendantType === "Hilot"
                    ? x(370)
                    : data.attendantType === "Others"
                      ? x(580)
                      : x(0),
        }}
      >
        {data.attendantType && <span>x</span>}
      </span>
      {/* Attendant Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(658),
          left: x(200),
        }}
      >
        {data.attendantName}
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
        {data.attendantAddress}
      </span>

      {/* Attendant Position */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(680),
          left: x(200),
        }}
      >
        {data.attendantPosition}
      </span>

      {/* Attendant Signed Date */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(680),
          left: x(500),
        }}
      >
        {data.attendantCertificationDate}
      </span>

      {/* Infromant */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(760),
          left: x(150),
        }}
      >
        {data.informantName}
      </span>
      {/* informant relationship */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(775),
          left: x(200),
        }}
      >
        {data.informantRelationship}
      </span>
      {/* informat address */}
      <span
        className="absolute text-[8px] birth-font"
        style={{
          top: y(795),
          left: x(110),
        }}
      >
        {data.informantAddress}
      </span>

      {/* informant signature data */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(810),
          left: x(100),
        }}
      >
        {data.informantDate}
      </span>

      {/* prepared by */}
      {/* Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(860),
          left: x(160),
        }}
      >
        {data.preparedByName}
      </span>
      {/* Posistion */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(880),
          left: x(160),
        }}
      >
        {data.preparedByPosition}
      </span>
      {/* date */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(900),
          left: x(110),
        }}
      >
        {data.preparedByDate}
      </span>

      {/* recieved  by */}
      {/* Name */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(860),
          left: x(160),
        }}
      >
        {data.receivedByName}
      </span>
      {/* Posistion */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(880),
          left: x(160),
        }}
      >
        {data.receivedByPosition}
      </span>
      {/* date */}
      <span
        className="absolute text-[10px] birth-font"
        style={{
          top: y(900),
          left: x(110),
        }}
      >
        {data.receivedByDate}
      </span>
    </FormPreviewContainer>
  );
}
