import React, { useEffect, useState } from "react";
import { fetchProducts } from 'lib/dbConnect';
import NextLink from "next/link";
import { Pagination } from '@mui/material';
import { useRouter } from 'next/router';

// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";

// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
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
  Link
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

export default function EcommerceCheckout() {
  const { t } = useTranslation("products");
  const { product, user: userState } = useSelector((state: any) => state);
  const user = userState?.user;
  const [apicall, setapicall] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const [statestep, setStateStep] = useState(0);
  const { cart, activeStep, total, shipping, subtotal, discount } =
    product.checkout;
  const isComplete = activeStep === STEPS.length;

  const [products, setProducts] = useState<any>(null);
  const router = useRouter();
  const page = router.query.page ? parseInt(router.query.page as string) : 1; // Set page to 1 if null
  const firstTag = router.query['tags[]'];


  useEffect(() => {
    async function fetchData() {
      try {
        let all = {
          page: page,
        };
        const fetchedProducts = await fetchProducts(all);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    if (page) {
      fetchData();
    }
  }, [page]); // Fetch data whenever the page query changes


  interface Product {
    id: number;
    // category: {
    //   id: number;
    //   title: string;
    //   slug: string;
    //   position: number;
    //   active: number;
    //   images: any[]; // Adjust this type as needed
    //   parent_id: number;
    //   url: string;
    // };
    variations: any[];
    images: any[]; // Adjust this type as needed
    title: string;
    slug: string;
    description: string;
  }

  const handleClick = (page: number) => {
    router.push({
      query: {
        page: page,
        'tags[]': firstTag
      },
    });
  };

  return (
    <Elements stripe={stripePromise}>
      <RootStyles
        title="Products | Expozy Blog"
        description="Expozy Blog"
        canonical="Products"
      >
        <Container>
          <Box py={5}>
            <>
              <Collapse in={statestep !== 2}>
                <Grid container spacing={3}>
                  {products &&
                    products.result &&
                    products.result.map((product: Product, index: number) => (
                      <Grid item md={4} xs={12} key={index}>
                        <NextLink href={`/product/${product.slug}?id=${product.id}`} passHref>
                          <Link underline="none">
                            <Card>
                              <CardMedia
                                component="img"
                                sx={{ width: '100%', height: '200px' }}
                                image={product.images[0] ? product.images[0].thumb_image : ""}
                                alt={product.title}
                                loading="lazy"
                              />
                              <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                  {product.title}
                                </Typography>
                                <Typography variant="h5" component="div" color="error">
                                  {product.variations[0].price.toFixed(2) + ' ' + product.variations[0].currency}
                                </Typography>
                                
                              </CardContent>
                            </Card>
                          </Link>
                        </NextLink>
                      </Grid>
                    ))}
                </Grid>
              </Collapse>
            </>
          </Box>
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
            <Pagination
              count={10}
              page={page}
              variant="outlined"
              onChange={(event, page) => handleClick(page)} // This is for accessibility purposes
            />
          </div>
        </Container>
      </RootStyles>
    </Elements>
  );
}
