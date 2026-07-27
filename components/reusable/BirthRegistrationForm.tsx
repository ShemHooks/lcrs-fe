"use client";

import { Card } from "../ui/card";
import AddressSelector from "./AddressSelector";
import { FloatingInput } from "./FloatingInput";
import { BirthRegistrationData } from "@/lib/types/birth-registration";

interface BirthRegistrationFormProps {
  formData: BirthRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<BirthRegistrationData>>;
}

const BirthRegistrationForm = ({
  formData,
  setFormData,
}: BirthRegistrationFormProps) => {
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full">
      <Card className="rounded-sm p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Birth Certificate Registration Form
        </h1>

        <div className="space-y-4">
          {/* Address */}
          <div className="border-b border-gray-500">
            <h5 className="mb-2 font-medium">Address</h5>

            <AddressSelector
              fields={["region", "province", "city"]}
              value={formData.address}
              onChange={(value) => updateField("address", value)}
            />
          </div>

          {/* Child's Data */}
          <div className="border-b border-gray-500">
            <h5 className="mb-2 font-medium">Child's Data</h5>

            {/* Name */}
            <div className="mb-2 grid grid-cols-3 gap-2">
              <label className="col-span-3">1. NAME:</label>

              <FloatingInput
                label="First"
                value={formData.childFirstName}
                onChange={(e) => updateField("childFirstName", e.target.value)}
              />

              <FloatingInput
                label="Middle"
                value={formData.childMiddleName}
                onChange={(e) => updateField("childMiddleName", e.target.value)}
              />

              <FloatingInput
                label="Last"
                value={formData.childLastName}
                onChange={(e) => updateField("childLastName", e.target.value)}
              />
            </div>

            {/* Gender */}
            <div className="mb-2">
              <label>2. GENDER:</label>

              <div className="mt-2 flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === "Male"}
                    onChange={() => updateField("gender", "Male")}
                  />
                  Male
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === "Female"}
                    onChange={() => updateField("gender", "Female")}
                  />
                  Female
                </label>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="mb-2">
              <label>3. DATE OF BIRTH:</label>

              <input
                type="date"
                className="ml-4"
                value={formData.childBirthDate}
                onChange={(e) => updateField("birthDate", e.target.value)}
              />
            </div>

            {/* Place of Birth */}
            <div className="mb-2">
              <label>4. PLACE OF BIRTH:</label>

              <AddressSelector
                fields={["region", "province", "city", "barangay"]}
                value={formData.placeOfBirth}
                onChange={(value) => updateField("placeOfBirth", value)}
              />

              <FloatingInput
                label="Name of Hospital/Clinic/Institution/House No./St"
                value={formData.hospitalName}
                onChange={(e) => updateField("hospitalName", e.target.value)}
              />
            </div>

            {/* Type of Birth */}
            <div className="mb-2">
              <label>5a. TYPE OF BIRTH:</label>

              <FloatingInput
                label="Single,Twin,Triplet,etc."
                value={formData.typeOfBirth}
                onChange={(e) => updateField("typeOfBirth", e.target.value)}
              />
            </div>

            {/* Multiple Birth */}
            <div className="mb-2">
              <label>5b. IF MULTIPLE BIRTH, CHILD WAS:</label>

              <FloatingInput
                label="First,Second,Third,etc."
                value={formData.multipleBirthOrder}
                onChange={(e) =>
                  updateField("multipleBirthOrder", e.target.value)
                }
              />
            </div>

            {/* Birth Order */}
            <div className="mb-2">
              <label>5c. BIRTH ORDER:</label>

              <FloatingInput
                label="Order of this birth to previous live births including fatal death"
                value={formData.birthOrder}
                onChange={(e) => updateField("birthOrder", e.target.value)}
              />
            </div>

            {/* Weight */}
            <div className="mb-2">
              <label>6. WEIGHT AT BIRTH:</label>

              <div className="mt-4 flex items-end gap-2">
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className="h-10 w-20 border-b-2 border-black text-center focus:outline-0"
                />
                <p>grams</p>
              </div>
            </div>
          </div>

          {/* Mother's Data */}
          <div className="border-b border-gray-500">
            <h5 className="mb-2 font-medium">Mother's Data</h5>

            {/*  Name */}
            <div className="mb-2 grid grid-cols-3 gap-2">
              <label className="col-span-3">7. MAIDEN NAME:</label>

              <FloatingInput
                label="First"
                value={formData.motherFirstName}
                onChange={(e) => updateField("motherFirstName", e.target.value)}
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
                onChange={(e) => updateField("motherLastName", e.target.value)}
              />
            </div>

            {/*  Citizenship */}
            <div className="mb-2  gap-2">
              <label className="col-span-3">8. CITIZENSHIP:</label>

              <FloatingInput
                label="Citizenship"
                value={formData.motherCitizenship}
                onChange={(e) =>
                  updateField("motherCitizenship", e.target.value)
                }
              />
            </div>
            {/*  Religion */}
            <div className="mb-2  gap-2">
              <label className="col-span-3">9. RELIGION/RELIGIOUS SECT:</label>

              <FloatingInput
                label="Religion"
                value={formData.motherReligion}
                onChange={(e) => updateField("motherReligion", e.target.value)}
              />
            </div>

            {/*  total number of children born alive */}
            <div className="mb-2  gap-2">
              <label className="col-span-3">
                10a. TOTAL NUMBER OF CHILDREN BORN ALIVE:
              </label>

              <FloatingInput
                label="No. of children born"
                value={formData.totalNumOfChildren}
                onChange={(e) =>
                  updateField("totalNumOfChildren", e.target.value)
                }
              />
            </div>

            {/*  total number of children born alive */}
            <div className="mb-2  gap-2">
              <label className="col-span-3">
                10b. NO. OF CHILDREN STILL LIVING INCLUDING THIS BIRTH:
              </label>

              <FloatingInput
                label="No. of living children"
                value={formData.noOfChildrenAlive}
                onChange={(e) =>
                  updateField("noOfChildrenAlive", e.target.value)
                }
              />
            </div>

            {/*  total number of children born alive */}
            <div className="mb-2  gap-2">
              <label className="col-span-3">
                10c. NO. OF CHILDREN BORN ALIVE BUT ARE NOW DEAD:
              </label>

              <FloatingInput
                label="No. of dean children"
                value={formData.noOfChildrenDead}
                onChange={(e) =>
                  updateField("noOfChildrenDead", e.target.value)
                }
              />
            </div>

            {/*  occupation */}
            <div className="mb-2  gap-2">
              <label className="col-span-3">11. OCCUPATION:</label>

              <FloatingInput
                label="Occupation"
                value={formData.motherOccupation}
                onChange={(e) =>
                  updateField("motherOccupation", e.target.value)
                }
              />
            </div>

            {/*  total number of children born alive */}
            <div className="mb-2  gap-2">
              <label className="col-span-3">
                12. AGE AT THE TIME OF THIS BIRTH:
              </label>

              <FloatingInput
                label="Complete Years"
                value={formData.motherAge}
                onChange={(e) => updateField("motherAge", e.target.value)}
              />
            </div>

            {/* Residence */}
            <div className="mb-2">
              <label>13. RESIDENCE:</label>

              <AddressSelector
                fields={["region", "province", "city", "barangay"]}
                value={formData.motherResidence}
                onChange={(value) => updateField("motherResidence", value)}
              />

              <FloatingInput
                label="House No./St"
                value={formData.motherHouserOrSt}
                onChange={(e) =>
                  updateField("motherHouserOrSt", e.target.value)
                }
              />
            </div>
          </div>

          {/* Father's Data */}
          <div className="border-b border-gray-500">
            <h5 className="mb-2 font-medium">Father's Data</h5>

            <div className="mb-2 grid grid-cols-3 gap-2">
              <label className="col-span-3">14. NAME:</label>

              <FloatingInput
                label="First"
                value={formData.fatherFirstName}
                onChange={(e) => updateField("fatherFirstName", e.target.value)}
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
                onChange={(e) => updateField("fatherLastName", e.target.value)}
              />
            </div>

            <FloatingInput
              label="15. Citizenship"
              value={formData.fatherCitizenship}
              onChange={(e) => updateField("fatherCitizenship", e.target.value)}
            />

            <FloatingInput
              label="16. Religion / Religious Sect"
              value={formData.fatherReligion}
              onChange={(e) => updateField("fatherReligion", e.target.value)}
            />

            <FloatingInput
              label="17. Occupation"
              value={formData.fatherOccupation}
              onChange={(e) => updateField("fatherOccupation", e.target.value)}
            />

            <FloatingInput
              label="18. Age"
              value={formData.fatherAge}
              onChange={(e) => updateField("fatherAge", e.target.value)}
            />

            <div className="mt-4">
              <label>19. Residence</label>

              <AddressSelector
                fields={["region", "province", "city", "barangay"]}
                value={formData.fatherResidence}
                onChange={(value) => updateField("fatherResidence", value)}
              />

              <FloatingInput
                label="House No. / Street"
                value={formData.fatherHouseOrSt}
                onChange={(e) => updateField("fatherHouseOrSt", e.target.value)}
              />
            </div>
          </div>

          {/* Marriage of Parents */}
          <div className="border-b border-gray-500">
            <h5 className="mb-2 font-medium">Marriage of Parents</h5>

            <div className="mb-4">
              <label>20a. Date of Marriage</label>

              <input
                type="date"
                value={formData.marriageDate}
                onChange={(e) => updateField("marriageDate", e.target.value)}
                className="ml-4"
              />
            </div>

            <div>
              <label>20b. Place of Marriage</label>

              <AddressSelector
                fields={["region", "province", "city"]}
                value={formData.marriagePlace}
                onChange={(value) => updateField("marriagePlace", value)}
              />

              {/* <FloatingInput
                label="House No. / Street"
                value={formData.marriageHouseOrSt}
                onChange={(e) =>
                  updateField("marriageHouseOrSt", e.target.value)
                }
              /> */}
            </div>
          </div>

          {/* Attendant */}
          <div className="border-b border-gray-500">
            <h5 className="mb-2 font-medium">Attendant At Birth</h5>

            <select
              className="w-full border p-2"
              value={formData.attendantType}
              onChange={(e) => updateField("attendantType", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Physician">Physician</option>
              <option value="Nurse">Nurse</option>
              <option value="Midwife">Midwife</option>
              <option value="Hilot">Hilot</option>
              <option value="Others">Others</option>
            </select>

            <FloatingInput
              label="Name"
              value={formData.attendantName}
              onChange={(e) => updateField("attendantName", e.target.value)}
            />

            <FloatingInput
              label="Address"
              value={formData.attendantAddress}
              onChange={(e) => updateField("attendantAddress", e.target.value)}
            />

            <FloatingInput
              label="Title / Position"
              value={formData.attendantPosition}
              onChange={(e) => updateField("attendantPosition", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={formData.attendantCertificationDate}
                onChange={(e) =>
                  updateField("attendantCertificationDate", e.target.value)
                }
              />

              <input
                type="time"
                value={formData.attendantCertificationTime}
                onChange={(e) =>
                  updateField("attendantCertificationTime", e.target.value)
                }
                className="m-2"
              />
            </div>
          </div>
          {/* Informant */}
          <div className="border-b border-gray-500">
            <h5 className="mb-2 font-medium">Certification of Informant</h5>

            <FloatingInput
              label="Name"
              value={formData.informantName}
              onChange={(e) => updateField("informantName", e.target.value)}
            />

            <FloatingInput
              label="Relationship to Child"
              value={formData.informantRelationship}
              onChange={(e) =>
                updateField("informantRelationship", e.target.value)
              }
            />

            <FloatingInput
              label="Address"
              value={formData.informantAddress}
              onChange={(e) => updateField("informantAddress", e.target.value)}
            />

            <input
              type="date"
              value={formData.informantDate}
              onChange={(e) => updateField("informantDate", e.target.value)}
              className="m-2"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BirthRegistrationForm;
