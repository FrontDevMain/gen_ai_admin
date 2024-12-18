import { Icon } from "@iconify/react";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  List,
  Modal,
  Pagination,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { END_POINTS } from "src/api/EndPoints";
import fetcher from "src/api/fetcher";

import { Filters } from "src/assets/icons/filter";
import { Plus } from "src/assets/icons/Plus";
import { useAuthContext } from "src/auth/useAuthContext";
import { Avatar } from "src/components/avatar";
import {
  MaskControl,
  StyledCard,
  StyledWrap,
} from "src/layouts/navbar/common/styles";
import { RootState } from "src/redux/reducers";
import { CustomListItemText } from "src/theme/globalStyles";

const CustomTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  "&:not(:last-child)": {
    marginBottom: "16px", // Adds spacing between rows
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.default",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

type usersList = {
  username: string;
  email: string;
  roles: string;
  license: boolean;
};

type filterTypes = {
  usernames: string;
  emails: string;
  roles: string;
  license: string | null;
};

function Users() {
  const [users, setUsers] = useState({
    usersList: [] as usersList[],
    total_pages: 0,
  });
  const [page, setPage] = useState(1);
  const [inviteEmails, setInviteEmails] = useState("");

  //filter
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);
  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const [selectedFilerTab, setSelectedFilterTab] = useState("usernames");
  const [filter, setFilter] = useState<filterTypes>({
    usernames: "",
    emails: "",
    roles: "",
    license: null,
  });

  //modal
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    getAllUsers(page, filter);
  }, [page]);

  const getAllUsers = async (
    currentPage: number,
    filters: filterTypes | {}
  ) => {
    try {
      const body = {
        ...Object.entries(filters)
          .filter((item) => item[1])
          ?.map((item) => ({
            [item[0]]: item[0] == "license" ? item[1] : [item[1]],
          }))[0],
      };
      const Response = await fetcher.post(
        END_POINTS.ADMIN.ADMIN_PRIVILEGES.USER_DETAILS(currentPage),
        body
      );
      if (Response.status == 200) {
        setUsers({
          total_pages: Response.data.pages,
          usersList: Response.data.items,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onInvite = async () => {
    try {
      const body = {
        emails: inviteEmails.split("\n"),
      };
      const Response = await fetcher.post(
        END_POINTS.ADMIN.ADMIN_PRIVILEGES.INVITE_USERS,
        body
      );
      if (Response.status == 200) {
        handleCloseModal();
        setInviteEmails("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeRole = (username: string, role: string) => {
    setUsers({
      ...users,
      usersList: users.usersList.map((item) =>
        item.username == username ? { ...item, roles: role } : item
      ),
    });
  };

  const updateUserlicense = (username: string) => {
    setUsers({
      ...users,
      usersList: users.usersList.map((item) =>
        item.username == username ? { ...item, license: !item.license } : item
      ),
    });
  };

  const resetFilters = () => {
    setFilter({ usernames: "", emails: "", roles: "", license: null });
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography>User List</Typography>
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <IconButton onClick={handleOpenPopover}>
            <Filters />
          </IconButton>
          <Popover
            id={id}
            anchorEl={anchorEl}
            open={openPopover}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <RadioGroup
              name="themeMode"
              value={selectedFilerTab}
              onChange={(e) => {
                setSelectedFilterTab(e.target.value);
                resetFilters();
              }}
            >
              <StyledWrap>
                {Object.keys(filter).map((mode) => (
                  <StyledCard key={mode} selected={selectedFilerTab == mode}>
                    <Stack flexDirection={"row"} gap={1}>
                      <Typography
                        color="text.primary"
                        sx={{ whiteSpace: "nowrap", p: 2 }}
                      >
                        {sentenceCase(mode)}
                      </Typography>
                    </Stack>
                    <MaskControl value={mode} />
                  </StyledCard>
                ))}
              </StyledWrap>
            </RadioGroup>
            <Box sx={{ p: 2 }}>
              {(selectedFilerTab == "usernames" ||
                selectedFilerTab == "emails") && (
                <TextField
                  fullWidth
                  label={sentenceCase(selectedFilerTab)}
                  value={filter[selectedFilerTab]}
                  onChange={(event: any) =>
                    setFilter({
                      ...filter,
                      [selectedFilerTab]: event.target.value,
                    })
                  }
                />
              )}

              {selectedFilerTab == "license" && (
                <RadioGroup
                  value={filter.license}
                  onChange={(e) =>
                    setFilter({ ...filter, license: e.target.value })
                  }
                >
                  {["Yes", "No"].map((item) => (
                    <FormControlLabel
                      label={item}
                      value={item}
                      control={<Radio />}
                    />
                  ))}
                </RadioGroup>
              )}

              {selectedFilerTab == "roles" && (
                <RadioGroup
                  value={filter.roles}
                  onChange={(e) =>
                    setFilter({ ...filter, roles: e.target.value })
                  }
                >
                  {["User", "Admin", "SuperAdmin"].map((item) => (
                    <FormControlLabel
                      label={item}
                      value={item}
                      control={<Radio />}
                    />
                  ))}
                </RadioGroup>
              )}
              <Stack
                flexDirection={"row"}
                justifyContent={"end"}
                gap={1}
                my={2}
              >
                <LoadingButton
                  variant="outlined"
                  onClick={() => {
                    resetFilters();
                    handleClosePopover();
                    getAllUsers(1, {});
                  }}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  onClick={() => {
                    getAllUsers(1, filter);
                    setPage(1);
                    handleClosePopover();
                  }}
                >
                  Apply
                </LoadingButton>
              </Stack>
            </Box>
          </Popover>
          <Button
            variant="contained"
            sx={{ borderRadius: 12 }}
            onClick={handleOpenModal}
          >
            <Plus /> Invite User
          </Button>
        </Stack>
      </Stack>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.usersList.map((item, index) => (
              <UserDetail
                key={index}
                item={item}
                changeRole={changeRole}
                updateUserlicense={updateUserlicense}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        sx={{ position: "relative", bottom: -10, right: 10, width: "100%" }}
        alignItems={"end"}
      >
        {users.total_pages && (
          <Pagination
            count={users.total_pages}
            page={page}
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
              setPage(value);
            }}
            // variant="outlined"
            color="primary"
            size="small"
          />
        )}
      </Stack>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" mb={3}>
            Invite Users
          </Typography>
          <TextField
            fullWidth
            multiline
            maxRows={6}
            label="Enter Emails"
            value={inviteEmails}
            onChange={(e) => setInviteEmails(e.target.value)}
          />
          <Stack direction={"row"} gap={2} mt={3}>
            <Button variant="outlined" fullWidth onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" fullWidth onClick={onInvite}>
              Invite
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

function UserDetail({
  item,
  changeRole,
  updateUserlicense,
}: {
  item: usersList;
  changeRole: (username: string, role: string) => void;
  updateUserlicense: (username: string) => void;
}) {
  const { license } = useSelector((state: RootState) => state.license);
  const theme = useTheme();
  const { user } = useAuthContext();
  const [isloading, setIsLoading] = useState(false);
  //onclick popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //modal
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const toggleLicense = async () => {
    setIsLoading(true);
    try {
      const body = {
        signed_license_key: license.signed_license_key,
        username: item.username,
        [item.license ? "revoked_by_id" : "issued_by_id"]: user.user_id,
      };
      const Response = await fetcher.post(
        item.license
          ? END_POINTS.ADMIN.LICENSE.REVOKE_USER_LICENSE
          : END_POINTS.ADMIN.LICENSE.ISSUE_LICENSE,
        body
      );
      if (Response.status == 200) {
        updateUserlicense(item.username);
        handleClosePopover();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeRole = async (role: string) => {
    try {
      setIsLoading(true);
      const body = {
        user_username: item.username,
        roles: role,
      };
      const Response = await fetcher.put(
        END_POINTS.ADMIN.ADMIN_PRIVILEGES.USERS_ROLE,
        body
      );
      if (Response.status == 200) {
        handleCloseModal();
        changeRole(item.username, body.roles);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ p: 0.5 }}></TableCell>
      </TableRow>
      <CustomTableRow>
        <TableCell sx={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
          <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
            <Avatar
              src=""
              name={item.username}
              sx={{ height: 33, width: 33 }}
            />
            <Typography> {item.username}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography>{item.email}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{item.roles}</Typography>
        </TableCell>
        <TableCell>
          <Typography>
            {" "}
            <Chip
              label={item.license ? "YES" : "NO"}
              sx={{
                color: "common.white",
                backgroundColor: item.license ? "#008080" : "secondary.main",
              }}
            />
          </Typography>
        </TableCell>
        <TableCell
          sx={{ borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
        >
          {item.username != user.user_username && (
            <IconButton aria-describedby={id} onClick={handleOpenPopover}>
              <Icon
                icon="mynaui:dots-solid"
                width="30px"
                height="30px"
                style={{
                  backgroundColor: theme.palette.background.neutral,
                  borderRadius: 20,
                }}
              />
            </IconButton>
          )}
          <Popover
            id={id}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <List disablePadding sx={{ p: 1 }} onClick={handleClosePopover}>
              <CustomListItemText onClick={handleOpenModal}>
                Switch
              </CustomListItemText>
              {!item.license && (
                <CustomListItemText onClick={toggleLicense}>
                  Apply License
                </CustomListItemText>
              )}
              {item.license && user.user_accountType == "SuperAdmin" && (
                <CustomListItemText onClick={toggleLicense}>
                  Cancel License
                </CustomListItemText>
              )}

              <CustomListItemText>View</CustomListItemText>
            </List>
          </Popover>
        </TableCell>
      </CustomTableRow>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4">
            Change Role to
          </Typography>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-evenly"}
            gap={1}
            my={3}
          >
            {["User", "Admin", "SuperAdmin"].map((row) => (
              <LoadingButton
                variant="contained"
                disabled={item.roles == row || isloading}
                key={row}
                onClick={() => onChangeRole(row)}
              >
                {row}
              </LoadingButton>
            ))}
          </Stack>
          <Stack direction={"row"} justifyContent="end" gap={2} mt={3}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default Users;
