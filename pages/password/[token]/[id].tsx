import * as React from "react";
import { Field, FieldAttributes, Form, Formik, useField } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { z } from "zod";
import FormData from "form-data";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../api";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import Spinner from "../../../components/Loader";

const MyTextField: React.FC<FieldAttributes<{ isShown: boolean }>> = ({
  placeholder,
  isShown,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      className="w-full shadow"
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
      type={isShown ? "text" : "password"}
    />
  );
};

const validationSchema = z
  .object({
    newPassword: z.string().refine((val) => val.length >= 8, {
      message: "Password must be 8 characters",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface State {
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
}

interface PasswordChange {
  newPassword: string;
  confirmPassword: string;
}

const PasswordChange: React.FC = ({}) => {
  const [passwordChanged, setPasswordChanged] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState<State>({
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
  });

  const route = useRouter();

  const queryClient = useQueryClient();
  const changePassword = async (data: PasswordChange) => {
    const { data: response } = await axios.post(
      `${BASE_URL}password.recovery.set`,
      data,
      {
        headers: { "Accept-Language": "en-US,en;q=0.8" },
      }
    );
    return response.data;
  };

  const { mutate } = useMutation(changePassword, {
    onSuccess: (data) => {
      console.log(data);
      const message = "success";
      // alert(message);
    },
    onError: () => {
      console.log("there was an error");
    },
    onSettled: () => {
      queryClient.invalidateQueries("update");
    },
  });

  React.useEffect(() => {
    if (passwordChanged.result === "updated" && loading === false) {
      route.push(`/changedPassword/${passwordChanged.result}`);
    } else if (passwordChanged.status == "error" && loading === false) {
      route.push(`/changedPassword/${passwordChanged.result.error_id}`);
    }
  }, [passwordChanged, loading]);
  console.log(passwordChanged);

  let url = `http://192.168.1.46/labtest/elite-api-mcnaughtans/v1/password.recovery.set`;
  let form = new FormData();
  form.append("id", `${route.query.id}`);

  console.log("route??", route);

  const changePasswordUser = () => {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + route.query.token,
        "Accept-Language": "en-US,en;q=0.8",
        // "Content-Type": "multipart/form-data",
      },

      body: form,
    })
      .then((data) => data.json())
      .then((res) => {
        setPasswordChanged(res);
      })
      .catch((err) => console.log(err));
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  console.log("loading??", loading);

  return (
    <>
      <Header />
      <Spinner visible={loading} />
      {!loading && (
        <div className="h-full flex flex-col items-center justify-center overflow-y-hidden  mt-20">
          <h1 className="font-sans font-semibold text-2xl mr-1/3 text-[#25292E]">
            Change Password to McNaughtans
          </h1>
          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: "",
              showPassword: false,
            }}
            validationSchema={toFormikValidationSchema(validationSchema)}
            onSubmit={(data, { setSubmitting }) => {
              setValues({
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
                showPassword: data.showPassword,
              });
              form.append("password", data.newPassword);
              setSubmitting(true);

              const onSubmit = (data: PasswordChange) => {
                const passwordChange = {
                  ...data,
                };
                mutate(passwordChange);
              };
              // onSubmit(data);
              changePasswordUser();

              // //maske async call
              // console.log("data??", data);

              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form>
                <div
                  className="max-w-7xl space-y-4 mx-4 px-10 py-4 rounded-lg border shadow-xl m-10
                
            "
                >
                  {/* <h1 className="font-bold text-2xl  py-10 font-sans">
                    Create a New Password
                  </h1> */}

                  <div>
                    <h1 className="font-sans text-[#25292E] font-normal mb-2">
                      New Password
                    </h1>
                    <MyTextField
                      isShown={values.showPassword}
                      name="newPassword"
                      type={values.showPassword ? "text" : "password"}
                    />
                  </div>
                  <div>
                    <h1 className="font-sans text-[#25292E] font-normal mb-2">
                      Confirm New Password
                    </h1>
                    <MyTextField
                      isShown={values.showPassword}
                      name="confirmPassword"
                      type={values.showPassword ? "text" : "password"}
                    />
                  </div>
                  <FormControlLabel
                    className=""
                    control={<Checkbox checked={values.showPassword} />}
                    label={"Show Password"}
                    name="showPassword"
                    onChange={handleChange}
                  />

                  <Button
                    className="rounded-lg bg-[#25292E] p-4 text-white text-center mx-auto w-full   "
                    disabled={isSubmitting}
                    type="submit"
                  >
                    <h1 className="font-sans font-semibold text-white">
                      Update Password
                    </h1>
                  </Button>
                </div>

                {/* </div> */}
                {/* <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(errors, null, 2)}</pre> */}
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default PasswordChange;
