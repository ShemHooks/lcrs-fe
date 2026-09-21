"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Loader2,
  RotateCcw,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddressSelector from "@/components/reusable/AddressSelector";
import { FloatingInput } from "@/components/reusable/FloatingInput";

import { useBirthRegistration } from "@/server/hooks/birthcertificateHooks";
import { useClerkJobs } from "@/server/hooks/jobsHooks";

import { mapBirthRecordToFormData } from "@/lib/mappers/birthRegistrationMapper";
import type { BirthRegistrationData } from "@/lib/types/birth-registration";

// ============================================================
// PAGE
// ============================================================

export default function EditBirthCorrectionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const certificateId = params.id;

  // ============================================================
  // BIRTH REGISTRATION
  // ============================================================

  const {
    data: birthData,
    isLoading: isBirthLoading,
    isError: isBirthError,
    error: birthError,
  } = useBirthRegistration(certificateId);

  // ============================================================
  // CLERK JOBS
  // ============================================================

  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
    error: jobsError,
  } = useClerkJobs();

  const record = birthData?.data;

  const transaction = jobsData?.data.find(
    (job) => job.certificateId === certificateId,
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (isBirthLoading || isJobsLoading) {
    return <CorrectionEditLoading />;
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isBirthError || isJobsError || !record || !transaction) {
    let message = "Unable to load registration.";

    if (birthError instanceof Error) {
      message = birthError.message;
    } else if (jobsError instanceof Error) {
      message = jobsError.message;
    } else if (!record) {
      message = "Birth registration not found.";
    } else if (!transaction) {
      message = "Transaction not found.";
    }

    return <CorrectionEditError message={message} />;
  }

  // ============================================================
  // ONLY RETURNED TRANSACTIONS CAN BE CORRECTED
  // ============================================================

  if (transaction.status !== "Returned") {
    return (
      <InvalidCorrectionState
        status={transaction.status}
        certificateId={certificateId}
      />
    );
  }

  // ============================================================
  // EXISTING FORM DATA
  // ============================================================

  const initialData = mapBirthRecordToFormData(record);

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6 pb-16">
      {/* ====================================================== */}
      {/* BACK */}
      {/* ====================================================== */}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 text-slate-600"
        onClick={() => router.push(`/clerk/jobs/${certificateId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Registration
      </Button>

      {/* ====================================================== */}
      {/* PAGE HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
            Civil Registry Transaction
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Correct Birth Registration
            </h1>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
              <RotateCcw className="h-3.5 w-3.5" />
              Correction Mode
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Update the information requested by the reviewer. The existing birth
            registration will be updated instead of creating a new registration.
          </p>
        </div>

        {record.registryNumber && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 lg:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Registry Number
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {record.registryNumber}
            </p>
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* REVIEWER CORRECTION REQUEST */}
      {/* ====================================================== */}

      <Card className="overflow-hidden rounded-xl border border-red-200 shadow-sm">
        <div className="border-b border-red-100 bg-red-50/70 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <RotateCcw className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2 className="font-semibold text-red-900">
                Correction Requested
              </h2>

              <p className="mt-0.5 text-sm text-red-700">
                Review the request below before changing the registration.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          {(transaction.reviewer || transaction.reviewedAt) && (
            <div className="grid gap-5 sm:grid-cols-2">
              {transaction.reviewer && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <UserRound className="h-4 w-4 text-slate-500" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Reviewed By
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {[
                        transaction.reviewer.first_name,
                        transaction.reviewer.last_name,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </p>

                    {transaction.reviewer.position && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {transaction.reviewer.position}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {transaction.reviewedAt && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <CalendarDays className="h-4 w-4 text-slate-500" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Reviewed On
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatDateTime(transaction.reviewedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reviewer Comment
            </p>

            <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <p className="whitespace-pre-wrap text-sm font-medium leading-6 text-slate-700">
                  {transaction.reviewComment ||
                    "No correction comment was provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ====================================================== */}
      {/* DIRECT EDIT FORM */}
      {/* ====================================================== */}

      <CorrectionForm
        key={certificateId}
        certificateId={certificateId}
        initialData={initialData}
      />
    </div>
  );
}

// ============================================================
// CORRECTION FORM
// SAME UI AS REGISTRATION FORM, DIRECTLY IN THIS PAGE
// ============================================================

function CorrectionForm({
  certificateId,
  initialData,
}: {
  certificateId: string;
  initialData: BirthRegistrationData;
}) {
  const [formData, setFormData] = useState<BirthRegistrationData>(initialData);

  const updateField = (
    field: keyof BirthRegistrationData,
    value: BirthRegistrationData[keyof BirthRegistrationData],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSaveAndResubmit = () => {
    console.log("Certificate:", certificateId);
    console.log("Original data:", initialData);
    console.log("Corrected data:", formData);

    // API WILL BE CONNECTED NEXT.
  };

  return (
    <>
      {/* ====================================================== */}
      {/* SAME REGISTRATION FORM UI */}
      {/* ====================================================== */}

      <div className="w-full">
        <Card className="rounded-sm p-6">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Birth Certificate Registration Form
          </h1>

          <div className="space-y-4">
            {/* ================================================== */}
            {/* ADDRESS */}
            {/* ================================================== */}

            <div className="border-b border-gray-500">
              <h5 className="mb-2 font-medium">Address</h5>

              <AddressSelector
                fields={["region", "province", "city"]}
                value={formData.address}
                onChange={(value) => updateField("address", value)}
              />
            </div>

            {/* ================================================== */}
            {/* CHILD'S DATA */}
            {/* ================================================== */}

            <div className="border-b border-gray-500">
              <h5 className="mb-2 font-medium">Child&apos;s Data</h5>

              <div className="mb-2 grid grid-cols-3 gap-2">
                <label className="col-span-3">1. NAME:</label>

                <FloatingInput
                  label="First"
                  value={formData.childFirstName}
                  onChange={(e) =>
                    updateField("childFirstName", e.target.value)
                  }
                />

                <FloatingInput
                  label="Middle"
                  value={formData.childMiddleName}
                  onChange={(e) =>
                    updateField("childMiddleName", e.target.value)
                  }
                />

                <FloatingInput
                  label="Last"
                  value={formData.childLastName}
                  onChange={(e) => updateField("childLastName", e.target.value)}
                />
              </div>

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

              <div className="mb-2">
                <label>3. DATE OF BIRTH:</label>

                <input
                  type="date"
                  className="ml-4"
                  value={formData.childBirthDate}
                  onChange={(e) =>
                    updateField("childBirthDate", e.target.value)
                  }
                />
              </div>

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

              <div className="mb-2">
                <label>5a. TYPE OF BIRTH:</label>

                <FloatingInput
                  label="Single,Twin,Triplet,etc."
                  value={formData.typeOfBirth}
                  onChange={(e) => updateField("typeOfBirth", e.target.value)}
                />
              </div>

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

              <div className="mb-2">
                <label>5c. BIRTH ORDER:</label>

                <FloatingInput
                  label="Order of this birth to previous live births including fatal death"
                  value={formData.birthOrder}
                  onChange={(e) => updateField("birthOrder", e.target.value)}
                />
              </div>

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

            {/* ================================================== */}
            {/* MOTHER'S DATA */}
            {/* ================================================== */}

            <div className="border-b border-gray-500">
              <h5 className="mb-2 font-medium">Mother&apos;s Data</h5>

              <div className="mb-2 grid grid-cols-3 gap-2">
                <label className="col-span-3">7. MAIDEN NAME:</label>

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

              <div className="mb-2 gap-2">
                <label className="col-span-3">8. CITIZENSHIP:</label>

                <FloatingInput
                  label="Citizenship"
                  value={formData.motherCitizenship}
                  onChange={(e) =>
                    updateField("motherCitizenship", e.target.value)
                  }
                />
              </div>

              <div className="mb-2 gap-2">
                <label className="col-span-3">
                  9. RELIGION/RELIGIOUS SECT:
                </label>

                <FloatingInput
                  label="Religion"
                  value={formData.motherReligion}
                  onChange={(e) =>
                    updateField("motherReligion", e.target.value)
                  }
                />
              </div>

              <div className="mb-2 gap-2">
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

              <div className="mb-2 gap-2">
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

              <div className="mb-2 gap-2">
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

              <div className="mb-2 gap-2">
                <label className="col-span-3">11. OCCUPATION:</label>

                <FloatingInput
                  label="Occupation"
                  value={formData.motherOccupation}
                  onChange={(e) =>
                    updateField("motherOccupation", e.target.value)
                  }
                />
              </div>

              <div className="mb-2 gap-2">
                <label className="col-span-3">
                  12. AGE AT THE TIME OF THIS BIRTH:
                </label>

                <FloatingInput
                  label="Complete Years"
                  value={formData.motherAge}
                  onChange={(e) => updateField("motherAge", e.target.value)}
                />
              </div>

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

            {/* ================================================== */}
            {/* FATHER'S DATA */}
            {/* ================================================== */}

            <div className="border-b border-gray-500">
              <h5 className="mb-2 font-medium">Father&apos;s Data</h5>

              <div className="mb-2 grid grid-cols-3 gap-2">
                <label className="col-span-3">14. NAME:</label>

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

              <FloatingInput
                label="15. Citizenship"
                value={formData.fatherCitizenship}
                onChange={(e) =>
                  updateField("fatherCitizenship", e.target.value)
                }
              />

              <FloatingInput
                label="16. Religion / Religious Sect"
                value={formData.fatherReligion}
                onChange={(e) => updateField("fatherReligion", e.target.value)}
              />

              <FloatingInput
                label="17. Occupation"
                value={formData.fatherOccupation}
                onChange={(e) =>
                  updateField("fatherOccupation", e.target.value)
                }
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
                  onChange={(e) =>
                    updateField("fatherHouseOrSt", e.target.value)
                  }
                />
              </div>
            </div>

            {/* ================================================== */}
            {/* MARRIAGE OF PARENTS */}
            {/* ================================================== */}

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
              </div>
            </div>

            {/* ================================================== */}
            {/* ATTENDANT */}
            {/* ================================================== */}

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
                onChange={(e) =>
                  updateField("attendantAddress", e.target.value)
                }
              />

              <FloatingInput
                label="Title / Position"
                value={formData.attendantPosition}
                onChange={(e) =>
                  updateField("attendantPosition", e.target.value)
                }
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

            {/* ================================================== */}
            {/* INFORMANT */}
            {/* ================================================== */}

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
                onChange={(e) =>
                  updateField("informantAddress", e.target.value)
                }
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

      {/* ====================================================== */}
      {/* ACTIONS */}
      {/* ====================================================== */}

      <Card className="mt-6 rounded-xl border border-slate-200 p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-medium text-slate-900">Ready to resubmit?</h3>

            <p className="mt-1 text-sm text-slate-500">
              {hasChanges
                ? "You have made changes to this registration. Review them before resubmitting."
                : "Make the correction requested by the reviewer before resubmitting."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href={`/clerk/jobs/${certificateId}`}>Cancel</Link>
            </Button>

            <Button
              type="button"
              disabled={!hasChanges}
              onClick={handleSaveAndResubmit}
              className="bg-[#92191d] text-white hover:bg-[#761216]"
            >
              Save & Resubmit
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

// ============================================================
// INVALID STATE
// ============================================================

function InvalidCorrectionState({
  status,
  certificateId,
}: {
  status: "Pending" | "Returned" | "Approved";
  certificateId: string;
}) {
  let title = "Registration cannot be corrected";
  let description =
    "Only registrations returned by a reviewer can be corrected.";

  if (status === "Pending") {
    title = "Registration is awaiting review";
    description =
      "This registration is currently submitted and cannot be edited while it is waiting for reviewer action.";
  }

  if (status === "Approved") {
    title = "Registration is already approved";
    description =
      "Approved registrations cannot be edited through the correction workflow.";
  }

  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
          <AlertCircle className="h-6 w-6 text-amber-600" />
        </div>

        <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        <Button asChild variant="outline" className="mt-5">
          <Link href={`/clerk/jobs/${certificateId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registration
          </Link>
        </Button>
      </Card>
    </div>
  );
}

// ============================================================
// DATE
// ============================================================

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ============================================================
// LOADING
// ============================================================

function CorrectionEditLoading() {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#92191d]" />

        <p className="mt-3 text-sm text-slate-500">
          Loading correction form...
        </p>
      </div>
    </div>
  );
}

// ============================================================
// ERROR
// ============================================================

function CorrectionEditError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>

        <h2 className="mt-4 font-semibold text-slate-900">
          Unable to load correction form
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        <Button asChild variant="outline" className="mt-5">
          <Link href="/clerk/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Jobs
          </Link>
        </Button>
      </Card>
    </div>
  );
}
