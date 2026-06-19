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

  const birthDate = new Date(data.birthDate);

  const day = birthDate.getDate();
  const month = birthDate.toLocaleString("en-US", {
    month: "long",
  });
  const year = birthDate.getFullYear();

  return (
    <FormPreviewContainer imageSrc="/assets/birth_form.jpg">
      {/* Province */}
      <span
        className="absolute text-[11px] birth-font "
        style={{
          top: "88px",
          left: "100px",
        }}
      >
        {data.address.provinceName}
      </span>
      {/* City */}
      <span
        className="absolute text-[11px] birth-font "
        style={{
          top: "102px",
          left: "100px",
        }}
      >
        {formatCityName(data.address.cityName)}
      </span>
      {/* First Name */}
      <span
        className="absolute text-[11px] birth-font "
        style={{
          top: "132px",
          left: "100px",
        }}
      >
        {data.childFirstName}
      </span>

      {/* Middle Name */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "132px",
          left: "195px",
        }}
      >
        {data.childMiddleName}
      </span>

      {/* Last Name */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "132px",
          left: "300px",
        }}
      >
        {data.childLastName}
      </span>

      {/* Gender */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "158px",
          left: "85px",
        }}
      >
        {data.gender}
      </span>

      {/* Date of Birth */}
      {/* Day */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "158px",
          left: "227px",
        }}
      >
        {day}
      </span>

      {/* Month */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "158px",
          left: "278px",
        }}
      >
        {month}
      </span>

      {/* Year */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "158px",
          left: "355px",
        }}
      >
        {year}
      </span>

      {/* Hospital */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "188px",
          left: "45px",
        }}
      >
        {data.hospitalName},
      </span>
      {/* City */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "188px",
          left: "206px",
        }}
      >
        {formatCityName(data.placeOfBirth.cityName)},
      </span>
      {/* Province */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "188px",
          left: "300px",
        }}
      >
        {data.placeOfBirth.provinceName}
      </span>
      {/* type of birth */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "218px",
          left: "65px",
        }}
      >
        {data.typeOfBirth}
      </span>

      {/* If multiple */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "218px",
          left: "65px",
        }}
      >
        {data.multipleBirthOrder}
      </span>

      {/* birth order*/}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "225px",
          left: "270px",
        }}
      >
        {data.birthOrder}
      </span>

      {/* weight at birth */}
      <span
        className="absolute text-[11px] birth-font"
        style={{
          top: "222px",
          left: "356px",
        }}
      >
        {data.weight}
      </span>
    </FormPreviewContainer>
  );
}
