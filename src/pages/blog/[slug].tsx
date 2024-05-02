import React, { useEffect, useState } from "react";
import { fetchBlogPostById } from 'lib/dbConnect';
import NextLink from "next/link";
import { useRouter } from 'next/router';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ViewsIcon from '@mui/icons-material/Visibility';
import DateIcon from '@mui/icons-material/DateRange';
import TimeIcon from '@mui/icons-material/AccessTime';
import ShareIcon from '@mui/icons-material/Share';
import he from 'he';
// 

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
  Menu,
  MenuItem,
  ButtonGroup,
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

const CheckoutSummary = dynamic(
  () => import("src/components/_main/blog/checkoutSummary")
);

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
  const { t } = useTranslation("blog");
  const { product, user: userState } = useSelector((state: any) => state);
  const user = userState?.user;
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
  const { cart, activeStep, total, shipping, subtotal, discount } =
    product.checkout;
  const isComplete = activeStep === STEPS.length;

  const [blogPost, setBlogPost] = useState<any>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchData() {
      try {
        const blogPost = await fetchBlogPostById(id);
        setBlogPost(blogPost);
      } catch (error) {
        console.error('Error fetching BlogPosts:', error);
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

  const fullUrl = typeof window !== 'undefined' ? window.location.href : `${router.basePath}${router.asPath}`;


  return (
    <Elements stripe={stripePromise}>
      <RootStyles
        title="Blog"
        description="Blog"
        canonical="Blog"
      >
        <Container>
          <Box py={5}>
            <>
              <Collapse in={statestep !== 2}>
                <Grid item xs={12}>
                  <Card>
                    {blogPost && (
                      <>
                        <CardActionArea
                          sx={{
                            "& .MuiTouchRipple-root": {
                              display: "none !important", // Remove ripple effect
                            },
                            "&.Mui-focusVisible": {
                              boxShadow: "none !important", // Remove focus highlight
                            },
                          }}>
                          <CardMedia
                            component="img"
                            height="400"
                            image={blogPost.images[0].url}
                            alt={blogPost.title}
                            loading="lazy"
                          />
                          <CardContent>
                            <Box sx={{ display: 'flex', marginBottom: '16px', justifyContent: 'space-between' }}>
                              <Box>
                                <Button
                                  aria-controls="dropdown-menu"
                                  aria-haspopup="true"
                                  onClick={handleClick}
                                  className="w-[120px] border-gray-200 shadow-none"
                                  variant="outlined" size="small">
                                  <ShareIcon />
                                </Button>
                                <Menu
                                  id="dropdown-menu"
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={handleClose}>
                                  <MenuItem onClick={() => handleMenuItemClick(`https://www.facebook.com/sharer/sharer.php?u=` + fullUrl)}>
                                    <FacebookIcon sx={{ mr: 1 }} />
                                    Facebook
                                  </MenuItem>
                                  <MenuItem onClick={() => handleMenuItemClick(`https://twitter.com/share?url=` + fullUrl)}>
                                    <TwitterIcon sx={{ mr: 1 }} />
                                    Twitter
                                  </MenuItem>
                                  <MenuItem onClick={() => handleMenuItemClick(`https://www.linkedin.com/shareArticle?mini=true&url=` + fullUrl + `&title=` + blogPost.title)}>
                                    <LinkedInIcon sx={{ mr: 1 }} />
                                    LinkedIn
                                  </MenuItem>
                                </Menu>
                              </Box>
                              <Box sx={{ display: 'flex', gap: '3px' }}>
                                <Button size="small" sx={{ display: 'flex', alignItems: 'center' }} variant="outlined">
                                  <ViewsIcon sx={{ mr: 1 }} /> {/* Adjust margin as needed */}
                                  {blogPost.views}
                                </Button>

                                <Button size="small" sx={{ display: 'flex', alignItems: 'center' }} variant="outlined">
                                  <DateIcon sx={{ mr: 1 }} /> {/* Adjust margin as needed */}
                                  {new Date(blogPost.date_created).toLocaleDateString('en-US')}
                                </Button>

                                <Button size="small" sx={{ display: 'flex', alignItems: 'center' }} variant="outlined">
                                  <TimeIcon sx={{ mr: 1 }} /> {/* Adjust margin as needed */}
                                  {blogPost.read_time != 0 ? blogPost.read_time : 1} m.
                                </Button>
                              </Box>
                            </Box>
                            <Typography gutterBottom variant="h5" component="div">
                              {blogPost.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {blogPost.description_short}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" dangerouslySetInnerHTML={{ __html: blogPost.description }} />
                            {blogPost.tags.length > 0 && (
                              <div style={{ marginTop: '16px', overflowX: 'auto' }}>
                                <ButtonGroup variant="text" aria-label="Basic button group">
                                  {blogPost.tags.map((tag: string, index: number) => (
                                    <NextLink href={`/blog/?tags[]=${tag}`} passHref>
                                      <Link underline="none">
                                        <Button size="small" key={index} style={{ whiteSpace: 'nowrap' }}>{he.decode(tag).replace(/&ldquo;|&rdquo;/g, '"')}</Button>
                                      </Link>
                                    </NextLink>
                                  ))}
                                </ButtonGroup>
                              </div>
                            )}
                          </CardContent>
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
