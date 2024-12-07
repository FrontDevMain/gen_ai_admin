import {
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoadingButton } from "@mui/lab";
import fetcher from "src/api/fetcher";
import { END_POINTS } from "src/api/EndPoints";
import { PATH_AUTH } from "src/routes/path";

type FormValuesProps = {
  email: string;
  password: string;
  confirmPassword: string;
};

function AuthSignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email.")
      .required("Email or mobile number is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const body = new URLSearchParams();
      body.append("email", data.email);
      body.append("password", data.password);
      body.append("confirm_password", data.confirmPassword);
      const Response = await fetcher.post(END_POINTS.AUTH.SIGN_UP, body);
      localStorage.setItem("gen_ai_email", data.email);
      navigate(PATH_AUTH.verifySignupOtp, { state: { email: data.email } });
    } catch (err) {
      if (err?.status == 409) {
        navigate(PATH_AUTH.signupDetails);
      }
      console.log(err);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h3" textAlign={"center"} mb={3}>
        Signup
      </Typography>
      <Stack gap={2}>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Email
          </Typography>
          <RHFTextField name="email" />
        </Stack>

        <Stack>
          <Typography variant="body2" color="text.secondary">
            Password
          </Typography>
          <RHFTextField
            name="password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Icon
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Confirm Password
          </Typography>
          <RHFTextField
            name="confirmPassword"
            type={showPassword1 ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword1(!showPassword1)}
                    edge="end"
                  >
                    <Icon
                      icon={showPassword1 ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Sign Up
        </LoadingButton>
      </Stack>

      <Typography textAlign={"center"} my={2}>
        Already have an account?
        <Link
          variant="body2"
          color="primary"
          underline="none"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </Link>
      </Typography>
    </FormProvider>
  );
}

export default AuthSignUp;
