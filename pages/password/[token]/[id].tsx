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
import Image from "next/image";
import { useRouter } from "next/router";

const MyTextField: React.FC<FieldAttributes<{ isShown: boolean }>> = ({
  placeholder,
  isShown,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
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
  const [values, setValues] = React.useState<State>({
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
  });

  const route = useRouter();
  console.log("route??", route);

  const queryClient = useQueryClient();
  const changePassword = async (data: PasswordChange) => {
    const { data: response } = await axios.post(`${BASE_URL}login`, data, {
      headers: { "Accept-Language": "en-US,en;q=0.8" },
    });
    return response.data;
  };

  const { mutate, loading } = useMutation(changePassword, {
    onSuccess: (data) => {
      console.log(data);
      const message = "success";
      alert(message);
    },
    onError: () => {
      alert("there was an error");
    },
    onSettled: () => {
      queryClient.invalidateQueries("update");
    },
  });

  let url = `http://192.168.1.46/labtest/elite-api-mcnaughtans/v1/customers`;
  const form = new FormData();
  form.append("token", `${route.query.token}`);
  form.append("id", `${route.query.id}`);
  form.append("password", values.newPassword);
  // updateFormData.append("password", values.newPassword);

  const changePasswordUser = () => {
    fetch(url, {
      method: "POST",
      body: form,
    })
      .then((data) => data.json())
      .then((res) => {
        // updateForm.reset();
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className=" h-screen grid place-items-center m-auto ">
      <Image
        src={"/mcnaughtans.png"}
        width={300}
        height={100}
        className="object-cover"
      />
      <Formik
        initialValues={{
          newPassword: "",
          confirmPassword: "",
          showPassword: false,
        }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);

          setValues({
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
            showPassword: data.showPassword,
          });
          // const onSubmit = (data: PasswordChange) => {
          //   const passwordChange = {
          //     ...data,
          //   };
          //   mutate(passwordChange);
          // };
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
              className="flex flex-col items-start space-y-4 max-w-3xl
            "
            >
              <h2 className="font-bold text-xl text-center py-10">
                Update your password
              </h2>
              <FormControlLabel
                className="ml-auto"
                control={<Checkbox checked={values.showPassword} />}
                label={"Show Password"}
                name="showPassword"
                onChange={handleChange}
              />

              <label>New Password</label>
              <MyTextField
                isShown={values.showPassword}
                name="newPassword"
                type={values.showPassword ? "text" : "password"}
              />
              <label>Confirm New Password</label>
              <MyTextField
                isShown={values.showPassword}
                name="confirmPassword"
                type={values.showPassword ? "text" : "password"}
              />

              <Button
                className="rounded-lg bg-[#00CCBB] p-4 text-white text-center mx-auto w-full font-semibold"
                disabled={isSubmitting}
                type="submit"
              >
                Update Password
              </Button>
              {/* </div> */}
            </div>
            {/* <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(errors, null, 2)}</pre> */}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PasswordChange;
