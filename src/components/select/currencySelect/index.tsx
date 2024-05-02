// react
import React, { useState, useEffect } from "react";
import { fetchCurrencies } from 'lib/dbConnect';

// next
import useTranslation from "next-translate/useTranslation";

// redux
import { setCurrency, setUnitRate } from "src/redux/slices/settings";
import { useDispatch, useSelector } from "react-redux";

// api


// material
import {
  Stack,
  Typography,
  Box,
  Divider,
  FormControl,
  Select,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

//  list
import { CurrenciesList } from "src/components/lists";

// components
import { Popover } from "src/components/popover";
import config from "src/layout/config.json";

// styles
import RootStyled from "./styled";

export default function LocaleSelect({ ...props }) {
  const { isDrawer } = props;
  // const { currencies } = config;

  interface Currency {
    id: number
    code: string;
    symbol: string;
    value: string;
  }

  const [currencies, setCurrencies] = useState<Currency[]>([]);

   useEffect(() => {
    const fetchCurrenciesData = async () => {
      try {
        const currenciesData = await fetchCurrencies();
        setCurrencies(currenciesData);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrenciesData();
  }, []);


  const dispatch = useDispatch();
  const anchorRefCurrency = React.useRef(null);
  const { t: _t, lang } = useTranslation("common");
  const { currency } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [openCurrency, setOpenCurrency] = React.useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>(
    currency || "USD"
  );

  const handleOpenCurrency = () => {
    setOpenCurrency(true);
  };

  const handleCloseCurrency = () => {
    setOpenCurrency(false);
  };
  React.useEffect(() => {
    // mutate(currency);
    setSelectedCurrency(currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const t = React.useMemo(
    () => _t,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );
  return (
    <RootStyled>
      {isDrawer ? (
        <Box className="is-mobile">
          <FormControl fullWidth>
            <Select
              id="currencies-select"
              value={selectedCurrency}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCurrency(val);
                // mutate(val);
                const filtered: Currency | undefined = currencies.find((v) => v.code === val);
                dispatch(
                  setCurrency({ code: val, symbol: filtered?.symbol })
                );
                dispatch(setUnitRate(filtered?.value));
              }}
              fullWidth
              size="small"
              native
            >
              {currencies.map((cur) => (
                <option key={Math.random()} value={cur.code}>
                  {cur.code}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box className="is-desktop">
          <Typography
            variant="body1"
            color="text.secondary"
            className={`select-text ${openCurrency && "active"}`}
            ref={anchorRefCurrency}
            onClick={handleOpenCurrency}
          >
            {selectedCurrency}
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
          </Typography>
          <Popover
            open={openCurrency}
            onClose={handleCloseCurrency}
            anchorEl={anchorRefCurrency.current}
            sx={{
              width: 340,
            }}
          >
            <Stack className="popover-heading">
              <Typography variant="h6" color="text.primary" p={2}>
                {t("header.select-currency")} TestCur
              </Typography>
            </Stack>
            <Divider />
            <CurrenciesList
              currencies={currencies}
              handleCloseCurrency={() => handleCloseCurrency()}
              setSelectedCurrency={(v: string) => {
                setSelectedCurrency(v);
                const filtered = currencies.find((v: any) => v.code === v);
                // mutate(v);

                dispatch(setCurrency({ code: v, symbol: filtered?.symbol }));
              }}
              selectedCurrency={selectedCurrency}
              t={t}
            />
          </Popover>
        </Box>
      )}
    </RootStyled>
  );
}
