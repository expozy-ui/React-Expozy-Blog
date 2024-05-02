import * as React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import { InputAdornment } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { NoDataFound } from "src/components/illustrations";
import CircularProgress from "@mui/material/CircularProgress";

// redux

Search.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default function Search({ ...props }) {
  const { onClose, mobile } = props;

  const [state, setstate] = React.useState({
    products: [],
    categories: [],
    brands: [],
  });
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const [focus, setFocus] = React.useState(true);

  const handleListItemClick = (slug: string, type: string) => {
    !mobile && onClose(slug);
    router.push(
      type === "brand"
        ? `/products?brand=${slug}`
        : type === "category"
        ? `/products/${slug}`
        : `/product/${slug}`
    );
  };
  const onKeyDown = (e: any) => {
    if (e.keyCode == "38" || e.keyCode == "40") {
      setFocus(false);
    }
  };

  return (
    <>
      <Box className="scroll-main">
        <Box sx={{ height: mobile ? "auto" : "400px", overflow: "auto" }}>
          {!loading &&
            !Boolean(state.products.length) &&
            !Boolean(state.categories.length) &&
            !Boolean(state.brands.length) && <NoDataFound />}

          <>
            <>
              <MenuList
                sx={{
                  pt: 0,
                  overflow: "auto",
                  px: 1,
                  li: {
                    borderRadius: "4px",
                    border: `1px solid transparent`,
                    "&:hover, &.Mui-focusVisible, &.Mui-selected ": {
                      border: (theme) =>
                        `1px solid ${theme.palette.primary.main}`,
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.16),
                      h6: {
                        color: "primary.main",
                      },
                    },
                  },
                }}
                autoFocusItem={!focus}>

              </MenuList>
            </>
          </>
        </Box>
      </Box>
    </>
  );
}
