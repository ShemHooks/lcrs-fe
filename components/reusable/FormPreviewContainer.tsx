"use client";

import React from "react";

interface FormPreviewContainerProps {
  imageSrc: string;
  children?: React.ReactNode;
}

export default function FormPreviewContainer({
  imageSrc,
  children,
}: FormPreviewContainerProps) {
  return (
    <div className="w-full overflow-auto rounded-lg border bg-white">
      {/*
        This inner container is the coordinate system
        for both the certificate image and all overlays.
      */}
      <div className="relative mx-auto w-full min-w-[600px]">
        <img
          src={imageSrc}
          alt="Certificate of Live Birth Preview"
          className="block h-auto w-full select-none"
          draggable={false}
        />

        {children}
      </div>
    </div>
  );
}
