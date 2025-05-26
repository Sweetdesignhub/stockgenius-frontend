/**
 * File: SignUpForm
 * Description: A form component for user sign-up that includes OAuth options, validation with Yup and React Hook Form, and dynamic country/state selection. The form also features a phone input field and password confirmation. Upon submission, the form data is sent to the server, and callbacks handle success and error responses.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import OAuth from "../OAuth";
import { Country, State } from "country-state-city";
import PhoneInput from "react-phone-number-input";
import InputField from "./InputField";
import "react-phone-number-input/style.css";
import api from "../../config";
import { Link } from "react-router-dom";

const SignUpForm = ({
  onValidSubmit,
  onError,
  userData,
  setUserData,
  setIsLoading,
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    userData.country || ""
  );

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    }
  }, [selectedCountry]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: userData,
  });

  const handlePhoneChange = (value) => {
    setValue("phoneNumber", value, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    setUserData(data);
    // console.log(data);
    setIsLoading(true);

    api
      .post("/api/v1/auth/signup", data)
      .then((response) => {
        // console.log("Signup Successful:", response.data);
        setIsLoading(false);
        onValidSubmit(2);
      })
      .catch((error) => {
        console.error("Signup Error:", error);
        setIsLoading(false);
        onError(
          error.response?.data?.message ||
            error.response?.data?.error?.[0]?.message ||
            error.message ||
            "An unexpected error occurred"
        );
      });
  };

  watch("country");

  return (
    <div>      <h1 className="text-2xl text-center font-semibold mb-5">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <OAuth />        <div className="flex items-center justify-center my-2">
          <div className="flex-grow border-t border-[#FFFFFF66] dark:border-[#FFFFFF66] border-gray-300"></div>
          <p className="dark:text-[#FFFFFF] text-gray-700 text-center mx-3 text-xs">Or</p>
          <div className="flex-grow border-t border-[#FFFFFF66] dark:border-[#FFFFFF66] border-gray-300"></div>
        </div>
        <InputField
          label="Email address"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
        />
        <InputField
          label="Your Name"
          name="name"
          type="text"
          register={register}
          error={errors.name?.message}
        />        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password?.message}
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            error={errors.confirmPassword?.message}
          />
        </div>
        <PhoneInput
          international
          defaultCountry="IN"
          value={watch("phoneNumber")}
          onChange={handlePhoneChange}          className="bg-slate-100 text-black p-2 rounded-sm w-full text-sm"
        />
        {errors.phoneNumber && (
          <div className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</div>
        )}        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Select Country"
            name="country"
            register={() =>
              register("country", {
                onChange: (e) =>
                  setSelectedCountry(
                    countries.find((c) => c.name === e.target.value)
                  ),
              })
            }
            options={countries.map(({ name }) => ({
              value: name,
              label: name,
            }))}
            error={errors.country?.message}
          />
          <InputField
            label="Select State"
            name="state"
            register={register}
            options={states.map(({ name }) => ({ value: name, label: name }))}
            error={errors.state?.message}
          />
        </div>
        <button          type="submit"          className="auth-btn bg-[#1A2C5C] text-white p-1.5 rounded-lg hover:opacity-85 disabled:opacity-80 min-h-[34px] flex items-center justify-center"
        >
          Sign up
        </button>
        <div className="mt-3 text-center">
          <p className="dark:text-[#FFFFFF99] text-gray-500 text-xs">
            Already have an account?{" "}
            <Link to={"/sign-in"}>
              <span className="dark:text-white text-gray-800">Sign in</span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
