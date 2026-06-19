"use client";

import { useState } from "react";
import BirthRegistrationForm from "@/components/reusable/BirthRegistrationForm";
import BirthCertificatePreview from "@/components/reusable/BirthCertificatePreview";
import { BirthRegistrationData } from "@/lib/types/birth-registration";
import { Card } from "@/components/ui/card";

export default function Page() {
  const [formData, setFormData] = useState<BirthRegistrationData>({
    address: {
      regionCode: "",
      regionName: "",
      provinceCode: "",
      provinceName: "",
      cityCode: "",
      cityName: "",
    },

    // child

    childFirstName: "",
    childMiddleName: "",
    childLastName: "",

    gender: "",
    birthDate: "",

    placeOfBirth: {
      regionCode: "",
      regionName: "",
      provinceCode: "",
      provinceName: "",
      cityCode: "",
      cityName: "",
      barangayCode: "",
      barangayName: "",
    },

    hospitalName: "",

    typeOfBirth: "",
    multipleBirthOrder: "",
    birthOrder: "",
    weight: "",

    // mother
    motherFirstName: "",
    motherMiddleName: "",
    motherLastName: "",
    motherCitizenship: "",
    motherReligion: "",
    totalNumOfChildren: "",
    noOfChildrenAlive: "",
    noOfChildrenDead: "",
    motherOccupation: "",
    motherAge: "",
    motherResidence: {
      regionCode: "",
      regionName: "",
      provinceCode: "",
      provinceName: "",
      cityCode: "",
      cityName: "",
      barangayCode: "",
      barangayName: "",
    },
    motherHouserOrSt: "",
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <BirthRegistrationForm formData={formData} setFormData={setFormData} />
      </div>
      <div>
        <div className="sticky top-20 ">
          <BirthCertificatePreview data={formData} />
        </div>
      </div>
    </div>
  );
}
