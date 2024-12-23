import { Icon } from "@iconify/react";
import { Close, CloseOutlined, CloudUpload, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItemText,
  MenuItem,
  Modal,
  Pagination,
  Popover,
  Radio,
  RadioGroup,
  Select,
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
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { END_POINTS } from "src/api/EndPoints";
import fetcher from "src/api/fetcher";

import { Filters } from "src/assets/icons/filter";
import { Plus } from "src/assets/icons/Plus";
import { useAuthContext } from "src/auth/useAuthContext";
import ConfirmationModal from "src/components/CustomComponents/ConfirmationModal";
import {
  MaskControl,
  StyledCard,
  StyledWrap,
} from "src/layouts/navbar/common/styles";
import { RootState } from "src/redux/reducers";
import { CustomListItemText } from "src/theme/globalStyles";
import { formatDate } from "src/utils/utility";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { sentenceCase } from "change-case";
import RoleBasedGaurd from "src/auth/RoleBasedGaurd";

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

type filesType = {
  _id: string;
  filename: string;
  filetype: string;
  filesize: number;
  time_of_upload: string;
  department_tag: string;
  file_status: string;
  user_id: string;
  username: string;
  modified_at: string;
  modified_by: string;
  modified_by_username: string;
};

type filterTypes = {
  upload_date: Date | null;
  file_types: null | string;
  department_tags: null | string;
  file_statuses: null | string;
  sort_by: null | string;
  sort_order: null | string;
};

export default function FileRepository() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [files, setFiles] = useState({
    fileList: [] as filesType[],
    total_pages: 0,
  });
  const [page, setPage] = useState(1);

  const [file, setFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  //filter
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);
  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const [selectedFilerTab, setSelectedFilterTab] = useState("upload_date");
  const [filter, setFilter] = useState<filterTypes>({
    upload_date: null,
    file_types: "",
    department_tags: "",
    file_statuses: "",
    sort_by: "",
    sort_order: "",
  });

  //modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  useEffect(() => {
    getAllFiles(page, filter);
  }, [page]);

  const handleFileUpload = (event: any) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > 25 * 1024 * 1024) {
        alert("File size exceeds 25MB.");
        return;
      }
      setFile(uploadedFile);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > 25 * 1024 * 1024) {
        alert("File size exceeds 25MB.");
        return;
      }
      setFile(uploadedFile);
    }
  };

  const onUploadFile = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user.user_id);
      const Response = await fetcher.postFile(
        END_POINTS.ADMIN.FILE_REPOSITORIES.UPLOAD_FILE,
        formData
      );
      if (Response.status == 200) {
        handleClose();
        setFiles({ ...files, fileList: [...files.fileList, Response.data] });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllFiles = useCallback(
    async (currentPage: number, filters: filterTypes | string) => {
      try {
        const Response = await fetcher.get(
          END_POINTS.ADMIN.FILE_REPOSITORIES.GET_ALL_FILES(
            currentPage,
            Object.entries(filters)
              .filter((item) => item[1])
              .map(
                (item) =>
                  `&${item[0]}=${
                    item[0] == "upload_date"
                      ? dayjs(item[1]).format("DD-MM-YYYY")
                      : (item[1] + "")?.toLowerCase()
                  }`
              )
              .join("")
          )
        );
        if (Response.status == 200) {
          setFiles({
            ...files,
            fileList: Response.data.files,
            total_pages: Response.data.total_pages,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [page]
  );

  const updateFileList = (method: string, data: any) => {
    if (method == "delete") {
      setFiles({
        ...files,
        fileList: files.fileList.filter((item) => item._id !== data),
      });
    }
    if (method == "rename") {
      setFiles({
        ...files,
        fileList: files.fileList.map((item) =>
          item._id == data._id ? data : item
        ),
      });
    }
  };

  const resetFilters = () => {
    setFilter({
      upload_date: null,
      file_types: "",
      department_tags: "",
      file_statuses: "",
      sort_by: "",
      sort_order: "",
    });
  };

  return (
    <RoleBasedGaurd roles={["Admin", "SuperAdmin"]}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography>File Repository</Typography>
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
                {Object.keys(filter)
                  .filter((item) => item !== "sort_by")
                  .map((mode) => (
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
            <Box sx={{ px: 2 }}>
              {selectedFilerTab == "upload_date" && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      sx={{ width: "100%" }}
                      label="Date"
                      value={dayjs(filter.upload_date)}
                      maxDate={dayjs(new Date())}
                      onChange={(newValue: any) =>
                        setFilter({ ...filter, upload_date: newValue })
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {(selectedFilerTab == "department_tags" ||
                selectedFilerTab == "file_statuses" ||
                selectedFilerTab == "file_types") && (
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
              {selectedFilerTab == "sort_order" && (
                <>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Sort By
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filter.sort_by}
                      label="Sort By"
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          sort_by: e.target.value,
                        })
                      }
                    >
                      {Object.keys(filter).map((elem) => (
                        <MenuItem value={elem}>{sentenceCase(elem)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <RadioGroup
                    name="sort"
                    value={filter.sort_order}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        [selectedFilerTab]: e.target.value,
                      })
                    }
                  >
                    {["", "desc"].map((item) => (
                      <FormControlLabel
                        label={item == "desc" ? "Descending" : "Ascending"}
                        value={item}
                        control={<Radio />}
                      />
                    ))}
                  </RadioGroup>
                </>
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
                    getAllFiles(1, "");
                  }}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  onClick={() => {
                    getAllFiles(1, filter);
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
            onClick={handleOpen}
          >
            <Plus /> Upload File
          </Button>
        </Stack>
      </Stack>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>File name</TableCell>
              <TableCell>File type</TableCell>
              <TableCell>File size</TableCell>
              <TableCell>Time of upload</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>File Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.fileList.map((item, index) => (
              <UserDetail
                key={item._id}
                item={item}
                updateFileList={updateFileList}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        sx={{ position: "relative", bottom: -10, right: 10, width: "100%" }}
        alignItems={"end"}
      >
        {files.total_pages > 0 && (
          <Pagination
            count={files.total_pages}
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
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack flexDirection={"row"} justifyContent={"space-between"}>
            <Typography color="text.disabled" onClick={handleOpen}>
              Upload
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack
            sx={{
              border: "2px dashed #ccc",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              position: "relative",
              backgroundColor: "#f9f9f9",
            }}
            alignItems={"center"}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <CloudUpload sx={{ fontSize: 50, textAlign: "center" }} />
            <Typography variant="body2" textAlign={"center"} sx={{ mt: 2 }}>
              <label
                htmlFor="file-upload"
                style={{ cursor: "pointer", color: theme.palette.primary.main }}
              >
                Click to Upload
              </label>{" "}
              or drag and drop
            </Typography>
            <Typography
              variant="caption"
              textAlign={"center"}
              color="text.disabled"
            >
              (Max. File size: 25 MB)
            </Typography>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </Stack>
          {file && (
            <Stack
              sx={{
                border: `1px solid  #ccc`,
                borderRadius: 1,
                px: 1,
                py: 3,
                mt: 1,
              }}
            >
              <Stack
                gap={4}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </Typography>
                <IconButton color="error" onClick={handleFileRemove}>
                  <Delete />
                </IconButton>
              </Stack>
              <LoadingButton
                variant="contained"
                onClick={onUploadFile}
                loading={isLoading}
              >
                Upload
              </LoadingButton>
            </Stack>
          )}
        </Box>
      </Modal>
    </RoleBasedGaurd>
  );
}

function UserDetail({
  item,
  updateFileList,
}: {
  item: filesType;
  updateFileList: (method: string, data: any) => void;
}) {
  const theme = useTheme();
  const { user } = useAuthContext();
  const { TAG } = useSelector((state: RootState) => state.tag);
  const [tagName, setTagName] = useState(item.department_tag);
  const [htmlContent, setHtmlContent] = useState("");

  //onclick popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  //modal
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  //preview modal
  const [openModal1, setOpenModal1] = useState(false);
  const handleOpenModal1 = () => setOpenModal1(true);
  const handleCloseModal1 = () => setOpenModal1(false);

  const downloadFiles = async (id: string) => {
    handleClosePopover();
    try {
      const Response = await fetcher.get(
        END_POINTS.ADMIN.FILE_REPOSITORIES.DOWNLOAD_FILES(id)
      );

      if (Response.status == 200) {
        const htmlString = Response.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const anchorTags = doc.querySelectorAll("a");
        const downloadLink = document.createElement("a");
        downloadLink.href = anchorTags[0].href;
        downloadLink.download = anchorTags[0].download;
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const previewFile = async (id: string) => {
    try {
      handleClosePopover();
      handleOpenModal1();
      const Response = await fetcher.get(
        END_POINTS.ADMIN.FILE_REPOSITORIES.DOWNLOAD_PREVIEW(id)
      );
      if (Response.status == 200) {
        setHtmlContent(Response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onModifyDepartment = async () => {
    handleClosePopover();
    try {
      const body = {
        file_id: item._id,
        department_tag: tagName,
        modified_by: user.user_id,
      };
      const Response = await fetcher.put(
        END_POINTS.ADMIN.FILE_REPOSITORIES.MODIFY_DEPARTMENT,
        body
      );
      if (Response.status == 200) {
        updateFileList("rename", Response.data);
        setTagName("");
        handleCloseModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTag = async () => {
    handleClosePopover();
    try {
      const Response = await fetcher.delete(
        END_POINTS.ADMIN.FILE_REPOSITORIES.DELETE_FILE(item._id)
      );
      if (Response.status == 200) {
        updateFileList("delete", item._id);
        handleClosePopover();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ p: 0.5 }}></TableCell>
      </TableRow>
      <CustomTableRow>
        <TableCell>
          <Typography>{item.username}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{item.filename}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{item.filetype}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{item.filesize}</Typography>
        </TableCell>
        <TableCell>
          {" "}
          <Typography noWrap>{formatDate(item.time_of_upload)}</Typography>
        </TableCell>
        <TableCell>
          {" "}
          <Typography>{item.department_tag}</Typography>
        </TableCell>
        <TableCell>
          {" "}
          <Typography>{item.file_status}</Typography>
        </TableCell>

        <TableCell
          sx={{ borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
        >
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
            <List disablePadding sx={{ p: 1 }}>
              <CustomListItemText onClick={() => previewFile(item._id)}>
                Preview
              </CustomListItemText>
              <CustomListItemText onClick={handleOpenConfirm}>
                Delete
              </CustomListItemText>
              <CustomListItemText onClick={() => downloadFiles(item._id)}>
                Download
              </CustomListItemText>
              <CustomListItemText onClick={handleOpenModal}>
                Modify Tag
              </CustomListItemText>
            </List>
          </Popover>
        </TableCell>
      </CustomTableRow>

      <ConfirmationModal
        open={openConfirm}
        handleClose={handleCloseConfirm}
        onConfirm={deleteTag}
        title={"Delete Confirmation"}
        content={"Are you sure you want to delete the tag ?"}
      />

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4">
            Modify Department
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tag Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tagName}
              label="Tag Name"
              onChange={(e) => setTagName(e.target.value)}
            >
              {TAG?.tags?.map((item) => (
                <MenuItem key={item._id} value={item.tag_name}>
                  {item.tag_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction={"row"} gap={2} mt={3}>
            <Button variant="outlined" fullWidth onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" fullWidth onClick={onModifyDepartment}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openModal1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: "90%", height: "90%" }}>
          <IconButton
            sx={{ position: "absolute", top: 10, left: 15 }}
            onClick={handleCloseModal1}
          >
            <Close />
          </IconButton>
          <Typography textAlign={"center"}>Preview</Typography>
          <div
            style={{
              height: "95%",
              width: "100%",
              marginTop: 10,
              overflow: "scroll",
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </Box>
      </Modal>
    </>
  );
}
