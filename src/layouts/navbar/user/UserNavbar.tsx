import {
  Box,
  Button,
  Collapse,
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  Popover,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  BookmarksSharp,
  LibraryBooksOutlined,
  PushPinOutlined,
} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/reducers";
import fetcher from "src/api/fetcher";
import { END_POINTS } from "src/api/EndPoints";
import { NotebookList } from "src/redux/actions/Notebook/NotebookActionTypes";
import { useAuthContext } from "src/auth/useAuthContext";
import { useDispatch } from "react-redux";
import {
  fetchNotebookList,
  fetchNotebookListSuccess,
  onNotebookDelete,
  toggleNotebookArchive,
  toggleNotebookPin,
} from "src/redux/actions/Notebook/NotebookActions";
import { LoadingButton } from "@mui/lab";
import { fetchChat } from "src/redux/actions/chat/ChatActions";
import {
  CustomListItemButton,
  CustomListItemText,
} from "src/theme/globalStyles";

const CustomListSubItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius, // Rounded corners
  color: theme.palette.text.secondary,
  backgroundColor: "transparent",
  "&:hover": {
    color: theme.palette.primary.main, // Selected text color
  },
  "&.Mui-selected": {
    color: theme.palette.primary.main, // Selected text color
    fontWeight: 700,
    "&:hover": {
      color: theme.palette.primary.main, // Darker on hover when selected
    },
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

export default function UserNavbar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const [active, setActive] = useState("Notebook");
  const { notebookList } = useSelector((state: RootState) => state.notebook);

  const [navbarList, setNavbarList] = useState<
    {
      segment: string;
      title: string;
      icon: any;
      children: any[];
    }[]
  >([]);

  useEffect(() => {
    setNavbarList([
      {
        segment: "notebook",
        title: "Notebook",
        icon: <LibraryBooksOutlined />,
        children: notebookList.filter((item) => !item.is_archieved),
      },
      {
        segment: "archive",
        title: "Archive",
        icon: <BookmarksSharp />,
        children: notebookList.filter((item) => item.is_archieved),
      },
    ]);
  }, [notebookList]);

  const createNewNotebook = async (userId: string) => {
    try {
      const body = {
        user_id: userId,
      };
      const Response = await fetcher.post(
        END_POINTS.USER.QUERY.CREATE_NOTEBOOK,
        body
      );
      if (Response.status == 200) {
        dispatch(fetchNotebookList(userId));
      }
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        overflow: "auto",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <List
        sx={{ maxWidth: 360, bgcolor: theme.palette.background.default }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {navbarList.map((item) => {
          return (
            <>
              <CustomListItemButton
                onClick={() => setActive(item.title)}
                selected={active == item.title}
              >
                <ListItemText primary={item.title} />
                <Tooltip title="New Chat" placement="top">
                  <Icon
                    onClick={(e) => {
                      e.stopPropagation();
                      createNewNotebook(user.user_id);
                    }}
                  >
                    {item.icon}
                  </Icon>
                </Tooltip>
              </CustomListItemButton>
              <Collapse in={active == item.title} timeout="auto" unmountOnExit>
                {item.children.map((child: NotebookList) => (
                  <SubNotebook child={child} />
                ))}
              </Collapse>
            </>
          );
        })}
      </List>
    </Box>
  );
}

const SubNotebook = ({ child }: { child: NotebookList }) => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const [headerName, setHeaderName] = useState("");
  const { CHAT } = useSelector((state: RootState) => state.chat);
  const { notebookList } = useSelector((state: RootState) => state.notebook);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);
  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  //modal
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setHeaderName("");
  };

  const onChangeHeaderName = async (chatId: string) => {
    try {
      setIsLoading(true);
      const body = {
        user_id: user.user_id,
        chat_id: chatId,
        header: headerName,
      };
      const Response = await fetcher.put(
        END_POINTS.USER.QUERY.RENAME_NOTEBOOK,
        body
      );
      if (Response.status == 200) {
        dispatch(
          fetchNotebookListSuccess(
            notebookList.map((item) =>
              item.chat_id == chatId
                ? { ...item, chat_header: headerName }
                : { ...item }
            )
          )
        );
        handleCloseModal();
        setHeaderName("");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <List component="div" disablePadding key={child.chat_id}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <CustomListSubItemButton
          sx={{ pl: 2 }}
          onClick={() => dispatch(fetchChat(user.user_id, child.chat_id))}
          selected={CHAT.chat_id == child.chat_id}
        >
          <Typography sx={{ flex: "1 1 0", fontWeight: "inherit" }}>
            {child.chat_header}
          </Typography>
          {child.is_pin ? (
            <PushPinOutlined
              sx={{
                transform: "rotate(45deg)",
                color: "primary.main",
                fontSize: 20,
              }}
            />
          ) : null}
          <IconButton
            aria-describedby={id}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenPopover(e);
            }}
          >
            <Icon>
              <MoreVertIcon />
            </Icon>
          </IconButton>
        </CustomListSubItemButton>
        <Popover
          id={id}
          anchorEl={anchorEl}
          open={openPopover}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <List
            disablePadding
            key={child.chat_id}
            sx={{ padding: 1 }}
            onClick={handleClosePopover}
          >
            <CustomListItemText
              onClick={() =>
                dispatch(toggleNotebookPin(user.user_id, child.chat_id))
              }
            >
              {child.is_pin ? "Unpin Chat from Top" : "Pin Chat on Top"}
            </CustomListItemText>
            <CustomListItemText
              onClick={() =>
                dispatch(toggleNotebookArchive(user.user_id, child.chat_id))
              }
            >
              {child.is_archieved ? "Unarchive" : "Archive"}
            </CustomListItemText>
            <CustomListItemText
              onClick={() => dispatch(onNotebookDelete(child.chat_id))}
            >
              Delete
            </CustomListItemText>
            <CustomListItemText
              onClick={() => {
                setHeaderName(child.chat_header);
                handleOpenModal();
              }}
            >
              Rename
            </CustomListItemText>
          </List>
        </Popover>
      </Stack>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <Typography id="modal-modal-title" variant="h4" mb={3}>
            Edit Header
          </Typography>
          <TextField
            fullWidth
            label="Tag Name"
            value={headerName}
            onChange={(e) => setHeaderName(e.target.value)}
          />
          <Stack direction={"row"} gap={2} mt={3}>
            <Button variant="outlined" fullWidth onClick={handleCloseModal}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              fullWidth
              loading={isLoading}
              onClick={() => onChangeHeaderName(child.chat_id)}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </List>
  );
};
