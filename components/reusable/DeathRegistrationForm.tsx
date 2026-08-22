"use client";

import { Card } from "../ui/card";
import AddressSelector from "./AddressSelector";
import { FloatingInput } from "./FloatingInput";
import { DeathRegistrationData } from "@/lib/types/death-registration";

interface DeathRegistrationFormProps {
  formData: DeathRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<DeathRegistrationData>>;
}

const DeathRegistrationForm = ({
  formData,
  setFormData,
}: DeathRegistrationFormProps) => {
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full">
      <Card className="rounded-sm p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Certificate of Death Registration Form
        </h1>

        <div className="space-y-4">
          {/* ===== HEADER ===== */}
          <div className="border-b border-gray-500 pb-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FloatingInput
                label="Province"
                value={formData.province}
                onChange={(e) => updateField("province", e.target.value)}
              />
              <FloatingInput
                label="City/Municipality"
                value={formData.cityMunicipality}
                onChange={(e) =>
                  updateField("cityMunicipality", e.target.value)
                }
              />
              <FloatingInput
                label="Registry No."
                value={formData.registryNumber}
                onChange={(e) => updateField("registryNumber", e.target.value)}
              />
            </div>
          </div>

          {/* ===== DECEASED INFORMATION ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">Deceased Information</h5>

            {/* 1. Name */}
            <div className="mb-3">
              <label className="text-sm font-medium">1. Name</label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                <FloatingInput
                  label="First"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
                <FloatingInput
                  label="Middle"
                  value={formData.middleName}
                  onChange={(e) => updateField("middleName", e.target.value)}
                />
                <FloatingInput
                  label="Last"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>
            </div>

            {/* 2. Sex */}
            <div className="mb-3">
              <label className="text-sm font-medium">2. Sex</label>
              <div className="mt-1 flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="deathSex"
                    checked={formData.sex === "Male"}
                    onChange={() => updateField("sex", "Male")}
                  />
                  Male
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="deathSex"
                    checked={formData.sex === "Female"}
                    onChange={() => updateField("sex", "Female")}
                  />
                  Female
                </label>
              </div>
            </div>

            {/* 3. Date of Death & 4. Date of Birth */}
            <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">
                  3. Date of Death
                </label>
                <input
                  type="date"
                  value={formData.dateOfDeath}
                  onChange={(e) => updateField("dateOfDeath", e.target.value)}
                  className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  4. Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 5. Age at Time of Death */}
            <div className="mb-3">
              <label className="text-sm font-medium">
                5. Age at the Time of Death
              </label>
              <div className="mt-2 grid grid-cols-5 gap-2">
                <FloatingInput
                  label="Years"
                  value={formData.ageYears}
                  onChange={(e) => updateField("ageYears", e.target.value)}
                />
                <FloatingInput
                  label="Months"
                  value={formData.ageMonths}
                  onChange={(e) => updateField("ageMonths", e.target.value)}
                />
                <FloatingInput
                  label="Days"
                  value={formData.ageDays}
                  onChange={(e) => updateField("ageDays", e.target.value)}
                />
                <FloatingInput
                  label="Hours"
                  value={formData.ageHours}
                  onChange={(e) => updateField("ageHours", e.target.value)}
                />
                <FloatingInput
                  label="Minutes"
                  value={formData.ageMinutes}
                  onChange={(e) => updateField("ageMinutes", e.target.value)}
                />
              </div>
            </div>

            {/* 6. Place of Death */}
            <div className="mb-3">
              <FloatingInput
                label="6. Place of Death (Name of Hospital/Clinic/Institution/House No., St.)"
                value={formData.placeOfDeath}
                onChange={(e) => updateField("placeOfDeath", e.target.value)}
              />
              <div className="mt-2">
                <AddressSelector
                  fields={["region", "province", "city", "barangay"]}
                  value={formData.placeOfDeathAddress}
                  onChange={(value) =>
                    updateField("placeOfDeathAddress", value)
                  }
                />
              </div>
            </div>

            {/* 7. Civil Status */}
            <div className="mb-3">
              <label className="text-sm font-medium">7. Civil Status</label>
              <div className="mt-1 flex flex-wrap gap-4">
                {["Single", "Married", "Widow", "Widower", "Annulled", "Divorced"].map(
                  (status) => (
                    <label key={status} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="deathCivilStatus"
                        checked={formData.civilStatus === status}
                        onChange={() => updateField("civilStatus", status)}
                      />
                      {status}
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* 8. Religion */}
            <div className="mb-3">
              <FloatingInput
                label="8. Religion / Religious Sect"
                value={formData.religion}
                onChange={(e) => updateField("religion", e.target.value)}
              />
            </div>

            {/* 9. Citizenship */}
            <div className="mb-3">
              <FloatingInput
                label="9. Citizenship"
                value={formData.citizenship}
                onChange={(e) => updateField("citizenship", e.target.value)}
              />
            </div>

            {/* 10. Residence */}
            <div className="mb-3">
              <label className="text-sm font-medium">
                10. Residence
              </label>
              <AddressSelector
                fields={["region", "province", "city", "barangay"]}
                value={formData.residence}
                onChange={(value) => updateField("residence", value)}
              />
              <FloatingInput
                label="House No., St."
                value={formData.residenceHouseOrStreet}
                onChange={(e) =>
                  updateField("residenceHouseOrStreet", e.target.value)
                }
              />
            </div>

            {/* 11. Occupation */}
            <div className="mb-3">
              <FloatingInput
                label="11. Occupation"
                value={formData.occupation}
                onChange={(e) => updateField("occupation", e.target.value)}
              />
            </div>

            {/* 12. Father */}
            <div className="mb-3">
              <label className="text-sm font-medium">
                12. Name of Father
              </label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                <FloatingInput
                  label="First"
                  value={formData.fatherFirstName}
                  onChange={(e) =>
                    updateField("fatherFirstName", e.target.value)
                  }
                />
                <FloatingInput
                  label="Middle"
                  value={formData.fatherMiddleName}
                  onChange={(e) =>
                    updateField("fatherMiddleName", e.target.value)
                  }
                />
                <FloatingInput
                  label="Last"
                  value={formData.fatherLastName}
                  onChange={(e) =>
                    updateField("fatherLastName", e.target.value)
                  }
                />
              </div>
            </div>

            {/* 13. Mother */}
            <div className="mb-3">
              <label className="text-sm font-medium">
                13. Maiden Name of Mother
              </label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                <FloatingInput
                  label="First"
                  value={formData.motherFirstName}
                  onChange={(e) =>
                    updateField("motherFirstName", e.target.value)
                  }
                />
                <FloatingInput
                  label="Middle"
                  value={formData.motherMiddleName}
                  onChange={(e) =>
                    updateField("motherMiddleName", e.target.value)
                  }
                />
                <FloatingInput
                  label="Last"
                  value={formData.motherLastName}
                  onChange={(e) =>
                    updateField("motherLastName", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== MEDICAL CERTIFICATE ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 text-center font-bold">Medical Certificate</h5>

            {/* 19b. Causes of Death */}
            <div className="mb-4">
              <label className="text-sm font-medium">
                19b. Causes of Death (if the deceased is aged 8 days and over)
              </label>

              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <FloatingInput
                    label="I. Immediate cause (a)"
                    value={formData.immediateCause}
                    onChange={(e) =>
                      updateField("immediateCause", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="Interval"
                    value={formData.immediateCauseInterval}
                    onChange={(e) =>
                      updateField("immediateCauseInterval", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <FloatingInput
                    label="Antecedent cause (b)"
                    value={formData.antecedentCause}
                    onChange={(e) =>
                      updateField("antecedentCause", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="Interval"
                    value={formData.antecedentCauseInterval}
                    onChange={(e) =>
                      updateField("antecedentCauseInterval", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <FloatingInput
                    label="Underlying cause (c)"
                    value={formData.underlyingCause}
                    onChange={(e) =>
                      updateField("underlyingCause", e.target.value)
                    }
                  />
                  <FloatingInput
                    label="Interval"
                    value={formData.underlyingCauseInterval}
                    onChange={(e) =>
                      updateField("underlyingCauseInterval", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mt-2">
                <FloatingInput
                  label="II. Other significant conditions contributing to death"
                  value={formData.otherSignificantConditions}
                  onChange={(e) =>
                    updateField("otherSignificantConditions", e.target.value)
                  }
                />
              </div>
            </div>

            {/* 19c. Maternal Condition */}
            <div className="mb-4">
              <label className="text-sm font-medium">
                19c. Maternal Condition (if the deceased is female aged 15-49
                years old)
              </label>
              <div className="mt-1 flex flex-wrap gap-4">
                {[
                  "Pregnant, not in labour",
                  "Pregnant, in labour",
                  "Less than 42 days after delivery",
                  "42 days to 1 year after delivery",
                  "None of the choices",
                ].map((condition) => (
                  <label
                    key={condition}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="maternalCondition"
                      checked={formData.maternalCondition === condition}
                      onChange={() =>
                        updateField("maternalCondition", condition)
                      }
                    />
                    {condition}
                  </label>
                ))}
              </div>
            </div>

            {/* 19d. Death by External Causes */}
            <div className="mb-4">
              <label className="text-sm font-medium">
                19d. Death by External Causes
              </label>
              <div className="mt-1 grid grid-cols-1 gap-2 md:grid-cols-2">
                <FloatingInput
                  label="a. Manner of death (Homicide, Suicide, Accident, etc.)"
                  value={formData.mannerOfDeath}
                  onChange={(e) =>
                    updateField("mannerOfDeath", e.target.value)
                  }
                />
                <FloatingInput
                  label="b. Place of Occurrence (home, farm, factory, street, sea, etc.)"
                  value={formData.placeOfExternalCause}
                  onChange={(e) =>
                    updateField("placeOfExternalCause", e.target.value)
                  }
                />
              </div>
            </div>

            {/* 20. Autopsy */}
            <div className="mb-3">
              <label className="text-sm font-medium">20. Autopsy</label>
              <div className="mt-1 flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="autopsy"
                    checked={formData.autopsy === "Yes"}
                    onChange={() => updateField("autopsy", "Yes")}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="autopsy"
                    checked={formData.autopsy === "No"}
                    onChange={() => updateField("autopsy", "No")}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* ===== ATTENDANT ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">21a. Attendant</h5>

            <div className="mb-3 flex flex-wrap gap-4">
              {[
                "Private Physician",
                "Public Health Officer",
                "Hospital Authority",
                "None",
                "Others",
              ].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="attendantType"
                    checked={formData.attendantType === type}
                    onChange={() => updateField("attendantType", type)}
                  />
                  {type}
                </label>
              ))}
            </div>

            {formData.attendantType === "Others" && (
              <FloatingInput
                label="Specify"
                value={formData.attendantOtherSpecify}
                onChange={(e) =>
                  updateField("attendantOtherSpecify", e.target.value)
                }
              />
            )}

            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">
                  21b. If attended, state duration — From
                </label>
                <input
                  type="date"
                  value={formData.attendedFrom}
                  onChange={(e) =>
                    updateField("attendedFrom", e.target.value)
                  }
                  className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">To</label>
                <input
                  type="date"
                  value={formData.attendedTo}
                  onChange={(e) => updateField("attendedTo", e.target.value)}
                  className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ===== CERTIFICATION OF DEATH ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">22. Certification of Death</h5>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <FloatingInput
                label="Signature Over Printed Name"
                value={formData.certifierSignature}
                onChange={(e) =>
                  updateField("certifierSignature", e.target.value)
                }
              />
              <FloatingInput
                label="Name in Print"
                value={formData.certifierName}
                onChange={(e) => updateField("certifierName", e.target.value)}
              />
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <FloatingInput
                label="Title or Position"
                value={formData.certifierPosition}
                onChange={(e) =>
                  updateField("certifierPosition", e.target.value)
                }
              />
              <FloatingInput
                label="Address"
                value={formData.certifierAddress}
                onChange={(e) =>
                  updateField("certifierAddress", e.target.value)
                }
              />
            </div>

            {/* Reviewed By */}
            <div className="mt-4 rounded-md bg-gray-50 p-3">
              <h6 className="mb-2 text-sm font-medium">Reviewed By</h6>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <FloatingInput
                  label="Signature Over Printed Name of Health Officer"
                  value={formData.healthOfficerSignature}
                  onChange={(e) =>
                    updateField("healthOfficerSignature", e.target.value)
                  }
                />
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={formData.healthOfficerDate}
                    onChange={(e) =>
                      updateField("healthOfficerDate", e.target.value)
                    }
                    className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== CORPSE DISPOSAL & PERMITS ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">
              23. Corpse Disposal / Permits
            </h5>

            {/* 23. Corpse Disposal */}
            <div className="mb-3">
              <label className="text-sm font-medium">
                23. Corpse Disposal
              </label>
              <div className="mt-1 flex gap-6">
                {["Burial", "Cremation", "Others"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="corpseDisposal"
                      checked={formData.corpseDisposal === type}
                      onChange={() => updateField("corpseDisposal", type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* 24a. Burial/Cremation Permit */}
            <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">
                  24a. Burial/Cremation Permit
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <FloatingInput
                    label="Number"
                    value={formData.burialPermitNumber}
                    onChange={(e) =>
                      updateField("burialPermitNumber", e.target.value)
                    }
                  />
                  <div>
                    <label className="text-xs text-gray-500">
                      Date Issued
                    </label>
                    <input
                      type="date"
                      value={formData.burialPermitDateIssued}
                      onChange={(e) =>
                        updateField(
                          "burialPermitDateIssued",
                          e.target.value,
                        )
                      }
                      className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 24b. Transfer Permit */}
              <div>
                <label className="text-sm font-medium">
                  24b. Transfer Permit
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <FloatingInput
                    label="Number"
                    value={formData.transferPermitNumber}
                    onChange={(e) =>
                      updateField("transferPermitNumber", e.target.value)
                    }
                  />
                  <div>
                    <label className="text-xs text-gray-500">
                      Date Issued
                    </label>
                    <input
                      type="date"
                      value={formData.transferPermitDateIssued}
                      onChange={(e) =>
                        updateField(
                          "transferPermitDateIssued",
                          e.target.value,
                        )
                      }
                      className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 25. Cemetery/Crematory */}
            <div>
              <FloatingInput
                label="25. Name and Address of Cemetery or Crematory"
                value={formData.cemeteryOrCrematory}
                onChange={(e) =>
                  updateField("cemeteryOrCrematory", e.target.value)
                }
              />
            </div>
          </div>

          {/* ===== CERTIFICATION OF INFORMANT ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">
              26. Certification of Informant
            </h5>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <FloatingInput
                label="Signature"
                value={formData.informantSignature}
                onChange={(e) =>
                  updateField("informantSignature", e.target.value)
                }
              />
              <FloatingInput
                label="Name in Print"
                value={formData.informantName}
                onChange={(e) => updateField("informantName", e.target.value)}
              />
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <FloatingInput
                label="Relationship to the Deceased"
                value={formData.informantRelationship}
                onChange={(e) =>
                  updateField("informantRelationship", e.target.value)
                }
              />
              <FloatingInput
                label="Address"
                value={formData.informantAddress}
                onChange={(e) =>
                  updateField("informantAddress", e.target.value)
                }
              />
            </div>

            <div className="mt-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={formData.informantDate}
                onChange={(e) => updateField("informantDate", e.target.value)}
                className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ===== PREPARED BY ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">27. Prepared By</h5>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <FloatingInput
                label="Signature"
                value={formData.preparedBySignature}
                onChange={(e) =>
                  updateField("preparedBySignature", e.target.value)
                }
              />
              <FloatingInput
                label="Name in Print"
                value={formData.preparedByName}
                onChange={(e) =>
                  updateField("preparedByName", e.target.value)
                }
              />
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <FloatingInput
                label="Title or Position"
                value={formData.preparedByPosition}
                onChange={(e) =>
                  updateField("preparedByPosition", e.target.value)
                }
              />
              <div>
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={formData.preparedByDate}
                  onChange={(e) =>
                    updateField("preparedByDate", e.target.value)
                  }
                  className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ===== RECEIVED BY / REGISTERED BY ===== */}
          <div className="border-b border-gray-500 pb-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 28. Received By */}
              <div className="space-y-2">
                <h5 className="font-medium">28. Received By</h5>
                <FloatingInput
                  label="Signature"
                  value={formData.receivedBySignature}
                  onChange={(e) =>
                    updateField("receivedBySignature", e.target.value)
                  }
                />
                <FloatingInput
                  label="Name in Print"
                  value={formData.receivedByName}
                  onChange={(e) =>
                    updateField("receivedByName", e.target.value)
                  }
                />
                <FloatingInput
                  label="Title or Position"
                  value={formData.receivedByPosition}
                  onChange={(e) =>
                    updateField("receivedByPosition", e.target.value)
                  }
                />
                <input
                  type="date"
                  value={formData.receivedByDate}
                  onChange={(e) =>
                    updateField("receivedByDate", e.target.value)
                  }
                  className="w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* 29. Registered By Civil Registrar */}
              <div className="space-y-2">
                <h5 className="font-medium">
                  29. Registered by the Civil Registrar
                </h5>
                <FloatingInput
                  label="Signature"
                  value={formData.registeredBySignature}
                  onChange={(e) =>
                    updateField("registeredBySignature", e.target.value)
                  }
                />
                <FloatingInput
                  label="Name in Print"
                  value={formData.registeredByName}
                  onChange={(e) =>
                    updateField("registeredByName", e.target.value)
                  }
                />
                <FloatingInput
                  label="Title or Position"
                  value={formData.registeredByPosition}
                  onChange={(e) =>
                    updateField("registeredByPosition", e.target.value)
                  }
                />
                <input
                  type="date"
                  value={formData.registeredByDate}
                  onChange={(e) =>
                    updateField("registeredByDate", e.target.value)
                  }
                  className="w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ===== REMARKS / ANNOTATIONS ===== */}
          <div>
            <h5 className="mb-2 font-medium">
              Remarks / Annotations (For LCRO/OCRG Use Only)
            </h5>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => updateField("remarks", e.target.value)}
              className="w-full border-b-2 border-gray-300 bg-transparent p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeathRegistrationForm;
