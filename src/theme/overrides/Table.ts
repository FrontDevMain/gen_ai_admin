import { Margin } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Table(theme: Theme) {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          position: "relative",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "none",
          padding: "10px 20px",
          fontSize: "16px",
        },
        head: {
          color: theme.palette.text.disabled,
          fontWeight: 400,
          backgroundColor: "transparent",
        },
        stickyHeader: {
          backgroundColor: theme.palette.background.neutral,
          // backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
        },
        paddingCheckbox: {
          paddingLeft: theme.spacing(1),
        },
      },
    },
    MuiTablePagination: {
      defaultProps: {
        backIconButtonProps: {
          size: "small",
        },
        nextIconButtonProps: {
          size: "small",
        },
        SelectProps: {
          MenuProps: {
            MenuListProps: {
              sx: {
                "& .MuiMenuItem-root": {
                  ...theme.typography.body1,
                },
              },
            },
          },
        },
      },

      styleOverrides: {
        root: {
          borderTop: `solid 1px ${theme.palette.divider}`,
        },
        toolbar: {
          height: 64,
        },
        actions: {
          marginRight: theme.spacing(1),
        },
        select: {
          "&:focus": {
            borderRadius: theme.shape.borderRadius,
          },
        },
      },
    },
  };
}
