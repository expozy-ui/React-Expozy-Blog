import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
// material
import { Fab, Box } from "@mui/material";

import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
// redux
// ----------------------------------------------------------------------

const Settings = dynamic(() => import("src/components/settings"), {
  ssr: false,
});

import NoInternet from "src/components/noInternet";
import MainNavbar from "./mainAppbar";
import RootStyled from "./styled";
import { useCycle } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "src/redux/slices/categories";
import { setNotifications } from "src/redux/slices/notification";
import { useQuery } from "react-query";

import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";

// const MobileAppbar = dynamic(() => import("./mobileAppbar"));
const Footer = dynamic(() => import("./footer"));

export default function MainLayout({ ...props }) {
  const { children } = props;
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const { currency } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [isOnline, setIsOnline] = useState(true);

  const checkIsOnline =
    typeof window !== "undefined" ? !window.navigator.onLine : null;
  useEffect(() => {
    if (checkIsOnline) {
      setIsOnline(false);
    } else {
      setIsOnline(true);
    }
  }, [checkIsOnline]);

  if (!isOnline) {
    return <NoInternet />;
  }
  useEffect(() => {
    // mutate(currency);
  }, []);

  const [isOpen, toggleOpen] = useCycle(false, true);
  return (
    <RootStyled>
      <MainNavbar />
      {/* <MobileAppbar /> */}
      <Box className="layout-main">
        <Fab
          onClick={() => toggleOpen()}
          color="primary"
          size="large"
          aria-label="language"
        >
          <TuneRoundedIcon />
        </Fab>
      </Box>
      <Settings isOpen={isOpen} toggleOpen={() => toggleOpen()} />
      <Box className="layout-children">{children}</Box>
      <Box className="children-height" />
      <Box>
        <Footer />
      </Box>
    </RootStyled>
  );
}
