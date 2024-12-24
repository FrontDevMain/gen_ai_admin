import { useTheme } from "@mui/material";
import React from "react";
import type { SVGProps } from "react";

export function DecreaseIcon(props: SVGProps<SVGSVGElement>) {
  const theme = useTheme();

  return (
    <svg
      width="13"
      height="9"
      viewBox="0 0 13 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.3463 0.639307C12.5455 0.830544 12.5519 1.14706 12.3607 1.34627L9.00069 4.84627C8.90641 4.94448 8.77615 5 8.64 5C8.50385 5 8.37359 4.94448 8.27931 4.84627L6.24 2.72199L3.82335 5.23933L5.54513 6.89223L0 8.5L1.38019 2.8939L3.10197 4.5468L5.87931 1.65373C5.97359 1.55552 6.10385 1.5 6.24 1.5C6.37615 1.5 6.50641 1.55552 6.60069 1.65373L8.64 3.77801L11.6393 0.653735C11.8305 0.454529 12.1471 0.44807 12.3463 0.639307Z"
        fill={theme.palette.error.main}
      />
    </svg>
  );
}
