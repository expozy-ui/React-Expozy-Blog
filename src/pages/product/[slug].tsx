import React, { useEffect, useState } from "react";
import { fetchProductById } from 'lib/dbConnect';
import NextLink from "next/link";
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// 

// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";

// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Step,
  Stepper,
  Container,
  StepLabel,
  Button,
  StepConnector,
  Collapse,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Menu,
  MenuItem,
  ButtonGroup,
  Link,
  IconButton
} from "@mui/material";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";

// redux
import { useDispatch, useSelector } from "react-redux";
import { getCart, createBilling, onGotoStep } from "src/redux/slices/product";

// hooks
import useIsMountedRef from "src/hooks/useIsMountedRef";

// stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// api

import { useQuery } from "react-query";

// components
import { Page } from "src/components";



// ----------------------------------------------------------------------

const STEPS = ["cart", "billing-address", "payment"];
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary.dark} 0%, 50%,${theme.palette.primary.light} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary.dark} 0%, 50%,${theme.palette.primary.light} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  "&.active": {
    backgroundImage: `linear-gradient( 136deg,  ${theme.palette.primary.dark} 0%,  50%, ${theme.palette.primary.light} 100%)`,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  "&.completed": {
    backgroundImage: `linear-gradient( 136deg,  ${theme.palette.primary.dark} 0%,  50%, ${theme.palette.primary.light} 100%)`,
  },
}));

function ColorlibStepIcon({ ...props }) {
  const { active, completed } = props;
  // alert(completed);
  const icons: any = {
    1: <ShoppingBasketRoundedIcon />,
    2: <ReceiptRoundedIcon />,
    3: <PaidRoundedIcon />,
  };

  return (
    <ColorlibStepIconRoot
      className={`${active && "active"} ${completed && "completed"}`}
    >
      {icons[props.icon]}
    </ColorlibStepIconRoot>
  );
}

const RootStyles = styled(Page)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  padding: "40px 0",
  backgroundColor: theme.palette.background.paper,
}));

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY as string);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function EcommerceCheckout() {
  const { t } = useTranslation("product");
  const [apicall, setapicall] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  // const { data, isLoading } = useQuery(
  //   ["address", user, apicall],
  //   () => api.getAddress(user._id),
  //   {
  //     enabled: Boolean(user),
  //   }
  // );
  // const addresses = data?.data || [];

  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const [statestep, setStateStep] = useState(0);


  const [product, setProduct] = useState<any>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchData() {
      try {
        const product = await fetchProductById(id);
        setProduct(product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    fetchData();
  }, []); // Run only once when the component mounts

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedValue, setSelectedValue] = React.useState('twitter');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null); // Explicitly set to null when closing the menu
  };

  const handleMenuItemClick = (url: string) => {
    router.push(url); // Redirect to the specified URL
    handleClose();
  };

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fullUrl = typeof window !== 'undefined' ? window.location.href : `${router.basePath}${router.asPath}`;

  return (
    <Elements stripe={stripePromise}>
      <RootStyles
        title="Product page"
        description="Expozy Blog"
        canonical="Blog"
      >
        <Container>
          <Box py={5}>
            <>
              <Collapse in={statestep !== 2}>
                <Grid item xs={12}>
                  <Card>
                    {product && (
                      <>
                        <CardActionArea>
                          <Box display={{ md: 'grid', lg: 'flex' }} height={{ md: 'auto', lg: '600px' }}>
                            <CardMedia
                              component="img"
                              sx={{
                                height: {
                                  md: '300px',
                                  lg: '100%'
                                },
                                maxWidth: {
                                  md: '100%',
                                  lg: '500px'
                                }
                              }}
                              image={product.images[0].image}
                              alt={product.title}
                              loading="lazy"
                            />
                            <CardContent>
                              <Typography gutterBottom variant="h5" component="div">
                                {product.title}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <IconButton onClick={handleDecrement} disabled={quantity === 1}>
                                    <RemoveIcon />
                                  </IconButton>
                                  <Typography sx={{ margin: '0 10px' }}>{quantity}</Typography>
                                  <IconButton onClick={handleIncrement}>
                                    <AddIcon />
                                  </IconButton>
                                </Box>
                                <Grid item>
                                  <Button variant="contained">Add to Cart</Button>
                                  <Button variant="outlined" sx={{ ml: 2 }}>Buy Now</Button>
                                </Grid>
                              </Box>
                              <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Description" {...a11yProps(0)} />
                                    <Tab label="Item Two" {...a11yProps(1)} />
                                    <Tab label="Item Three" {...a11yProps(2)} />
                                  </Tabs>
                                </Box>
                                <CustomTabPanel value={value} index={0}>
                                  <Typography variant="body1" color="text.secondary" sx={{ maxHeight: '300px', overflow: 'auto' }}>
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                  </Typography>
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                  Item Two
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={2}>
                                  Item Three
                                </CustomTabPanel>
                              </Box>

                            </CardContent>
                          </Box>
                        </CardActionArea>
                      </>
                    )}
                  </Card>
                </Grid>
              </Collapse>
            </>
          </Box>
        </Container>
      </RootStyles>
    </Elements>
  );
}