import { useTheme } from "@mui/material";
import React from "react";
import type { SVGProps } from "react";

export function Plus(props: SVGProps<SVGSVGElement>) {
  const theme = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      style={{ marginRight: 4 }}
      {...props}
    >
      <g fill="#fff" fillRule="evenodd" clipRule="evenodd">
        <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16"></path>
        <path d="M13 7a1 1 0 1 0-2 0v4H7a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4z"></path>
      </g>
    </svg>
  );
}
