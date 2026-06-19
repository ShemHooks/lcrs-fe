import FormPreviewContainer from "./FormPreviewContainer";
import { BirthRegistrationData } from "@/lib/types/birth-registration";

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

  return (
    <FormPreviewContainer imageSrc="/assets/birth_form.jpg">
      {/* Province */}
      <span
        className="absolute text-[11px] birth-font "
        style={{
          top: y(100),
          left: x(150),
        }}
      >
        {data.address.provinceName}
      </span>
      {/* City */}
      <span
        className="absolute text-[11px] birth-font "
        style={{
          top: y(120),
          left: x(190),
        }}
      >
        {formatCityName(data.address.cityName)}
      </span>
      {/* First Name */}
      <span
        className="absolute birth-font text-[12px]"
        style={{
          top: y(148),
          left: x(180),
        }}
      >
        {data.childFirstName}
      </span>

      {/* Middle Name */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(148),
          left: x(400),
        }}
      >
        {data.childMiddleName}
      </span>

      {/* Last Name */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(148),
          left: x(600),
        }}
      >
        {data.childLastName}
      </span>

      {/* Gender */}
      <span
        className="absolute text-[11px] birth-font"
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
        className="absolute text-[11px] birth-font"
        style={{
          top: y(178),
          left: x(450),
        }}
      >
        {day}
      </span>

      {/* Month */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(178),
          left: x(570),
        }}
      >
        {month}
      </span>

      {/* Year */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(178),
          left: x(700),
        }}
      >
        {year}
      </span>

      {/* place of birth */}
      <div
        className="absolute flex gap-2 text-[11px] birth-font"
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
        className="absolute text-[11px] birth-font"
        style={{
          top: y(260),
          left: x(190),
        }}
      >
        {data.typeOfBirth}
      </span>

      {/* If multiple */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(260),
          left: x(360),
        }}
      >
        {data.multipleBirthOrder}
      </span>

      {/* birth order*/}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(260),
          left: x(540),
        }}
      >
        {data.birthOrder}
      </span>

      {/* weight at birth */}
      <span
        className="absolute text-[11px] birth-font"
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
        className="absolute text-[11px] birth-font"
        style={{
          top: y(290),
          left: x(200),
        }}
      >
        {data.motherFirstName}
      </span>

      {/* Mother M Name */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(290),
          left: x(400),
        }}
      >
        {data.motherMiddleName}
      </span>
      {/* Mother L Name */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(290),
          left: x(600),
        }}
      >
        {data.motherLastName}
      </span>

      {/* Mother Citizenship */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(320),
          left: x(200),
        }}
      >
        {data.motherCitizenship}
      </span>
      {/* Mother Religion */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: y(320),
          left: x(600),
        }}
      >
        {data.motherReligion}
      </span>
    </FormPreviewContainer>
  );
}
