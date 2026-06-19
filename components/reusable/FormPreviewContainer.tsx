import { ReactNode } from "react";

interface FormPreviewContainerProps {
  imageSrc: string;
  children: ReactNode;
}

export default function FormPreviewContainer({
  imageSrc,
  children,
}: FormPreviewContainerProps) {
  return (
    <div className="relative overflow-auto rounded-lg border bg-white">
      <img src={imageSrc} alt="Form Preview" className="w-full h-full" />

      {children}
    </div>
  );
}
