import React from "react";
import * as Yup from "yup";
import { uniqueId } from "lodash";
import { useFormik, Form, FormikProvider } from "formik";
import useTranslation from "next-translate/useTranslation";
// material
import {
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  Dialog,
  DialogActions,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
//
import PhoneAutocomplete from "src/components/phoneAutocomplete";
import countries from "./countries.json";

// redux
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
// ----------------------------------------------------------------------

export default function CheckoutNewAddressForm({ ...props }) {
  const { open, onClose, onNextStep, onCreateBilling, apicall } = props;
  const { t } = useTranslation("checkout");
  const { user } = useSelector(({ user }: { user: any }) => user);
  const [loading, setloading] = React.useState<boolean>(false);

  const NewAddressSchema = Yup.object().shape({
    address: Yup.string().required(t("address-required")),
    city: Yup.string().required(t("city-required")),
    state: Yup.string().required(t("state-required")),
    country: Yup.string().required(),
    phone: Yup.string().required("Phone is required"),
    zip: Yup.number().required(t("postal-require")),
  });

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        ".MuiPaper-root": {
          bgcolor: "background.paper",
        },
      }}
    >
    </Dialog>
  );
}
