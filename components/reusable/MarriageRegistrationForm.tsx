"use client";

import { Card } from "../ui/card";
import AddressSelector from "./AddressSelector";
import { FloatingInput } from "./FloatingInput";
import { MarriageRegistrationData } from "@/lib/types/marriage-registration";

interface MarriageRegistrationFormProps {
  formData: MarriageRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<MarriageRegistrationData>>;
}

const MarriageRegistrationForm = ({
  formData,
  setFormData,
}: MarriageRegistrationFormProps) => {
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full">
      <Card className="rounded-sm p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Certificate of Marriage Registration Form
        </h1>

        <div className="space-y-4">
          {/* ===== HEADER: Province / City / Registry No. ===== */}
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

          {/* ===== HUSBAND & WIFE SIDE-BY-SIDE ===== */}
          <div className="border-b border-gray-500 pb-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* ---------- HUSBAND ---------- */}
              <div className="space-y-3">
                <h3 className="text-center text-lg font-bold uppercase tracking-wide">
                  Husband
                </h3>

                {/* 1. Name */}
                <div>
                  <label className="text-sm font-medium">
                    1. Name of Contracting Party
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <FloatingInput
                      label="First"
                      value={formData.groomFirstName}
                      onChange={(e) =>
                        updateField("groomFirstName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Middle"
                      value={formData.groomMiddleName}
                      onChange={(e) =>
                        updateField("groomMiddleName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Last"
                      value={formData.groomLastName}
                      onChange={(e) =>
                        updateField("groomLastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 2a. Date of Birth & 2b. Age */}
                <div>
                  <label className="text-sm font-medium">
                    2a. Date of Birth / 2b. Age
                  </label>
                  <div className="mt-1 grid grid-cols-4 gap-2">
                    <input
                      type="date"
                      value={formData.groomBirthDate}
                      onChange={(e) =>
                        updateField("groomBirthDate", e.target.value)
                      }
                      className="col-span-3 border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                    />
                    <FloatingInput
                      label="Age"
                      value={formData.groomAge}
                      onChange={(e) =>
                        updateField("groomAge", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 3. Place of Birth */}
                <div>
                  <FloatingInput
                    label="3. Place of Birth (City/Municipality, Province, Country)"
                    value={formData.groomPlaceOfBirth}
                    onChange={(e) =>
                      updateField("groomPlaceOfBirth", e.target.value)
                    }
                  />
                </div>

                {/* 4a. Sex / 4b. Citizenship */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">4a. Sex</label>
                    <div className="mt-1 flex gap-4">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name="groomSex"
                          checked={formData.groomSex === "Male"}
                          onChange={() => updateField("groomSex", "Male")}
                        />
                        Male
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name="groomSex"
                          checked={formData.groomSex === "Female"}
                          onChange={() => updateField("groomSex", "Female")}
                        />
                        Female
                      </label>
                    </div>
                  </div>
                  <FloatingInput
                    label="4b. Citizenship"
                    value={formData.groomCitizenship}
                    onChange={(e) =>
                      updateField("groomCitizenship", e.target.value)
                    }
                  />
                </div>

                {/* 5. Residence */}
                <div>
                  <label className="text-sm font-medium">
                    5. Residence
                  </label>
                  <AddressSelector
                    fields={["region", "province", "city", "barangay"]}
                    value={formData.groomResidence}
                    onChange={(value) => updateField("groomResidence", value)}
                  />
                  <FloatingInput
                    label="House No., St."
                    value={formData.groomHouseOrStreet}
                    onChange={(e) =>
                      updateField("groomHouseOrStreet", e.target.value)
                    }
                  />
                </div>

                {/* 6. Religion */}
                <div>
                  <FloatingInput
                    label="6. Religion / Religious Sect"
                    value={formData.groomReligion}
                    onChange={(e) =>
                      updateField("groomReligion", e.target.value)
                    }
                  />
                </div>

                {/* 7. Civil Status */}
                <div>
                  <FloatingInput
                    label="7. Civil Status"
                    value={formData.groomCivilStatus}
                    onChange={(e) =>
                      updateField("groomCivilStatus", e.target.value)
                    }
                  />
                </div>

                {/* 8. Name of Father */}
                <div>
                  <label className="text-sm font-medium">
                    8. Name of Father
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <FloatingInput
                      label="First"
                      value={formData.groomFatherFirstName}
                      onChange={(e) =>
                        updateField("groomFatherFirstName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Middle"
                      value={formData.groomFatherMiddleName}
                      onChange={(e) =>
                        updateField("groomFatherMiddleName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Last"
                      value={formData.groomFatherLastName}
                      onChange={(e) =>
                        updateField("groomFatherLastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 9. Father's Citizenship */}
                <div>
                  <FloatingInput
                    label="9. Citizenship"
                    value={formData.groomFatherCitizenship}
                    onChange={(e) =>
                      updateField("groomFatherCitizenship", e.target.value)
                    }
                  />
                </div>

                {/* 10. Maiden Name of Mother */}
                <div>
                  <label className="text-sm font-medium">
                    10. Maiden Name of Mother
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <FloatingInput
                      label="First"
                      value={formData.groomMotherFirstName}
                      onChange={(e) =>
                        updateField("groomMotherFirstName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Middle"
                      value={formData.groomMotherMiddleName}
                      onChange={(e) =>
                        updateField("groomMotherMiddleName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Last"
                      value={formData.groomMotherLastName}
                      onChange={(e) =>
                        updateField("groomMotherLastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 11. Mother's Citizenship */}
                <div>
                  <FloatingInput
                    label="11. Citizenship"
                    value={formData.groomMotherCitizenship}
                    onChange={(e) =>
                      updateField("groomMotherCitizenship", e.target.value)
                    }
                  />
                </div>

                {/* 12. Person Who Gave Consent */}
                <div>
                  <label className="text-sm font-medium">
                    12. Name of Person/Wali Who Gave Consent or Advice
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <FloatingInput
                      label="First"
                      value={formData.groomGuardianFirstName}
                      onChange={(e) =>
                        updateField(
                          "groomGuardianFirstName",
                          e.target.value,
                        )
                      }
                    />
                    <FloatingInput
                      label="Middle"
                      value={formData.groomGuardianMiddleName}
                      onChange={(e) =>
                        updateField(
                          "groomGuardianMiddleName",
                          e.target.value,
                        )
                      }
                    />
                    <FloatingInput
                      label="Last"
                      value={formData.groomGuardianLastName}
                      onChange={(e) =>
                        updateField(
                          "groomGuardianLastName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                {/* 13. Relationship */}
                <div>
                  <FloatingInput
                    label="13. Relationship"
                    value={formData.groomGuardianRelationship}
                    onChange={(e) =>
                      updateField("groomGuardianRelationship", e.target.value)
                    }
                  />
                </div>

                {/* 14. Guardian Residence */}
                <div>
                  <label className="text-sm font-medium">
                    14. Residence
                  </label>
                  <AddressSelector
                    fields={["region", "province", "city", "barangay"]}
                    value={formData.groomGuardianResidence}
                    onChange={(value) =>
                      updateField("groomGuardianResidence", value)
                    }
                  />
                  <FloatingInput
                    label="House No., St."
                    value={formData.groomGuardianHouseOrStreet}
                    onChange={(e) =>
                      updateField(
                        "groomGuardianHouseOrStreet",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* ---------- WIFE ---------- */}
              <div className="space-y-3">
                <h3 className="text-center text-lg font-bold uppercase tracking-wide">
                  Wife
                </h3>

                {/* 1. Name */}
                <div>
                  <label className="text-sm font-medium">
                    1. Name of Contracting Party
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <FloatingInput
                      label="First"
                      value={formData.brideFirstName}
                      onChange={(e) =>
                        updateField("brideFirstName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Middle"
                      value={formData.brideMiddleName}
                      onChange={(e) =>
                        updateField("brideMiddleName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Last"
                      value={formData.brideLastName}
                      onChange={(e) =>
                        updateField("brideLastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 2a. Date of Birth & 2b. Age */}
                <div>
                  <label className="text-sm font-medium">
                    2a. Date of Birth / 2b. Age
                  </label>
                  <div className="mt-1 grid grid-cols-4 gap-2">
                    <input
                      type="date"
                      value={formData.brideBirthDate}
                      onChange={(e) =>
                        updateField("brideBirthDate", e.target.value)
                      }
                      className="col-span-3 border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                    />
                    <FloatingInput
                      label="Age"
                      value={formData.brideAge}
                      onChange={(e) =>
                        updateField("brideAge", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 3. Place of Birth */}
                <div>
                  <FloatingInput
                    label="3. Place of Birth (City/Municipality, Province, Country)"
                    value={formData.bridePlaceOfBirth}
                    onChange={(e) =>
                      updateField("bridePlaceOfBirth", e.target.value)
                    }
                  />
                </div>

                {/* 4a. Sex / 4b. Citizenship */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">4a. Sex</label>
                    <div className="mt-1 flex gap-4">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name="brideSex"
                          checked={formData.brideSex === "Male"}
                          onChange={() => updateField("brideSex", "Male")}
                        />
                        Male
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name="brideSex"
                          checked={formData.brideSex === "Female"}
                          onChange={() => updateField("brideSex", "Female")}
                        />
                        Female
                      </label>
                    </div>
                  </div>
                  <FloatingInput
                    label="4b. Citizenship"
                    value={formData.brideCitizenship}
                    onChange={(e) =>
                      updateField("brideCitizenship", e.target.value)
                    }
                  />
                </div>

                {/* 5. Residence */}
                <div>
                  <label className="text-sm font-medium">
                    5. Residence
                  </label>
                  <AddressSelector
                    fields={["region", "province", "city", "barangay"]}
                    value={formData.brideResidence}
                    onChange={(value) => updateField("brideResidence", value)}
                  />
                  <FloatingInput
                    label="House No., St."
                    value={formData.brideHouseOrStreet}
                    onChange={(e) =>
                      updateField("brideHouseOrStreet", e.target.value)
                    }
                  />
                </div>

                {/* 6. Religion */}
                <div>
                  <FloatingInput
                    label="6. Religion / Religious Sect"
                    value={formData.brideReligion}
                    onChange={(e) =>
                      updateField("brideReligion", e.target.value)
                    }
                  />
                </div>

                {/* 7. Civil Status */}
                <div>
                  <FloatingInput
                    label="7. Civil Status"
                    value={formData.brideCivilStatus}
                    onChange={(e) =>
                      updateField("brideCivilStatus", e.target.value)
                    }
                  />
                </div>

                {/* 8. Name of Father */}
                <div>
                  <label className="text-sm font-medium">
                    8. Name of Father
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <FloatingInput
                      label="First"
                      value={formData.brideFatherFirstName}
                      onChange={(e) =>
                        updateField("brideFatherFirstName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Middle"
                      value={formData.brideFatherMiddleName}
                      onChange={(e) =>
                        updateField("brideFatherMiddleName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Last"
                      value={formData.brideFatherLastName}
                      onChange={(e) =>
                        updateField("brideFatherLastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 9. Father's Citizenship */}
                <div>
                  <FloatingInput
                    label="9. Citizenship"
                    value={formData.brideFatherCitizenship}
                    onChange={(e) =>
                      updateField("brideFatherCitizenship", e.target.value)
                    }
                  />
                </div>

                {/* 10. Maiden Name of Mother */}
                <div>
                  <label className="text-sm font-medium">
                    10. Maiden Name of Mother
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <FloatingInput
                      label="First"
                      value={formData.brideMotherFirstName}
                      onChange={(e) =>
                        updateField("brideMotherFirstName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Middle"
                      value={formData.brideMotherMiddleName}
                      onChange={(e) =>
                        updateField("brideMotherMiddleName", e.target.value)
                      }
                    />
                    <FloatingInput
                      label="Last"
                      value={formData.brideMotherLastName}
                      onChange={(e) =>
                        updateField("brideMotherLastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* 11. Mother's Citizenship */}
                <div>
                  <FloatingInput
                    label="11. Citizenship"
                    value={formData.brideMotherCitizenship}
                    onChange={(e) =>
                      updateField("brideMotherCitizenship", e.target.value)
                    }
                  />
                </div>

                {/* 12. Person Who Gave Consent */}
                <div>
                  <label className="text-sm font-medium">
                    12. Name of Person/Wali Who Gave Consent or Advice
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <FloatingInput
                      label="First"
                      value={formData.brideGuardianFirstName}
                      onChange={(e) =>
                        updateField(
                          "brideGuardianFirstName",
                          e.target.value,
                        )
                      }
                    />
                    <FloatingInput
                      label="Middle"
                      value={formData.brideGuardianMiddleName}
                      onChange={(e) =>
                        updateField(
                          "brideGuardianMiddleName",
                          e.target.value,
                        )
                      }
                    />
                    <FloatingInput
                      label="Last"
                      value={formData.brideGuardianLastName}
                      onChange={(e) =>
                        updateField(
                          "brideGuardianLastName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                {/* 13. Relationship */}
                <div>
                  <FloatingInput
                    label="13. Relationship"
                    value={formData.brideGuardianRelationship}
                    onChange={(e) =>
                      updateField("brideGuardianRelationship", e.target.value)
                    }
                  />
                </div>

                {/* 14. Guardian Residence */}
                <div>
                  <label className="text-sm font-medium">
                    14. Residence
                  </label>
                  <AddressSelector
                    fields={["region", "province", "city", "barangay"]}
                    value={formData.brideGuardianResidence}
                    onChange={(value) =>
                      updateField("brideGuardianResidence", value)
                    }
                  />
                  <FloatingInput
                    label="House No., St."
                    value={formData.brideGuardianHouseOrStreet}
                    onChange={(e) =>
                      updateField(
                        "brideGuardianHouseOrStreet",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== MARRIAGE DETAILS ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">Marriage Details</h5>

            {/* 15. Place of Marriage */}
            <div className="mb-3">
              <FloatingInput
                label="15. Place of Marriage (Office/House/Barangay/Church/Mosque)"
                value={formData.placeOfMarriage}
                onChange={(e) =>
                  updateField("placeOfMarriage", e.target.value)
                }
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <FloatingInput
                  label="City/Municipality"
                  value={formData.placeOfMarriageCity}
                  onChange={(e) =>
                    updateField("placeOfMarriageCity", e.target.value)
                  }
                />
                <FloatingInput
                  label="Province"
                  value={formData.placeOfMarriageProvince}
                  onChange={(e) =>
                    updateField("placeOfMarriageProvince", e.target.value)
                  }
                />
              </div>
            </div>

            {/* 16. Date of Marriage / 17. Time of Marriage */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  16. Date of Marriage
                </label>
                <input
                  type="date"
                  value={formData.dateOfMarriage}
                  onChange={(e) =>
                    updateField("dateOfMarriage", e.target.value)
                  }
                  className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  17. Time of Marriage
                </label>
                <input
                  type="time"
                  value={formData.timeOfMarriage}
                  onChange={(e) =>
                    updateField("timeOfMarriage", e.target.value)
                  }
                  className="mt-1 w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ===== CERTIFICATION OF SOLEMNIZING OFFICER ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">
              19. Certification of the Solemnizing Officer
            </h5>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <FloatingInput
                label="Signature Over Printed Name"
                value={formData.solemnizingOfficerName}
                onChange={(e) =>
                  updateField("solemnizingOfficerName", e.target.value)
                }
              />
              <FloatingInput
                label="Position / Designation"
                value={formData.solemnizingOfficerPosition}
                onChange={(e) =>
                  updateField("solemnizingOfficerPosition", e.target.value)
                }
              />
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
              <FloatingInput
                label="Religion / Religious Sect"
                value={formData.solemnizingOfficerReligion}
                onChange={(e) =>
                  updateField("solemnizingOfficerReligion", e.target.value)
                }
              />
              <FloatingInput
                label="Registry No."
                value={formData.solemnizingOfficerRegistryNo}
                onChange={(e) =>
                  updateField("solemnizingOfficerRegistryNo", e.target.value)
                }
              />
              <div>
                <label className="text-xs text-gray-500">
                  Expiry Date, if applicable
                </label>
                <input
                  type="date"
                  value={formData.solemnizingOfficerExpiryDate}
                  onChange={(e) =>
                    updateField(
                      "solemnizingOfficerExpiryDate",
                      e.target.value,
                    )
                  }
                  className="w-full border-b-2 border-gray-300 bg-transparent pb-2 pt-4 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ===== WITNESSES ===== */}
          <div className="border-b border-gray-500 pb-4">
            <h5 className="mb-3 font-medium">
              20a. Witnesses (Print Name and Sign)
            </h5>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FloatingInput
                  label="Witness 1 — Name"
                  value={formData.witness1Name}
                  onChange={(e) =>
                    updateField("witness1Name", e.target.value)
                  }
                />
                <FloatingInput
                  label="Witness 1 — Signature"
                  value={formData.witness1Signature}
                  onChange={(e) =>
                    updateField("witness1Signature", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <FloatingInput
                  label="Witness 2 — Name"
                  value={formData.witness2Name}
                  onChange={(e) =>
                    updateField("witness2Name", e.target.value)
                  }
                />
                <FloatingInput
                  label="Witness 2 — Signature"
                  value={formData.witness2Signature}
                  onChange={(e) =>
                    updateField("witness2Signature", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== RECEIVED BY / REGISTERED BY ===== */}
          <div className="border-b border-gray-500 pb-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 21. Received By */}
              <div className="space-y-2">
                <h5 className="font-medium">21. Received By</h5>
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

              {/* 22. Registered By */}
              <div className="space-y-2">
                <h5 className="font-medium">
                  22. Registered by the Civil Registrar
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
              Remarks / Annotations (For LCRO/OCRG/Shari&apos;a Circuit
              Registrar Use Only)
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

export default MarriageRegistrationForm;
