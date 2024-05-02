// material-ui components
import { Container, Box } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import LogoLoading from "src/components/logoLoading";
// components
import Page from "src/components/page";

// ----------------------------------------------------------------------

export default function UserProfile() {
  const router = useRouter();

  return (
    <Page title="User Profile | Expozy Blog" canonical="profile">
    </Page>
  );
}
