import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
// theme
import palette from "src/theme/palette";
// ----------------------------------------------------------------------
// eslint-disable-next-line react/display-name

const Page = ({ ...props }) => {
  const {
    children,
    id,
    title,
    description,
    openGraph,
    canonical = "",
    images,
    ...other
  } = props;
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical="http://expozy.com/"
        openGraph={
          openGraph || {
            url: "http://expozy.com/" + canonical,
            title: title,
            description: description,
          }
        }
        robotsProps={{
          nosnippet: true,
          notranslate: true,
          noimageindex: true,
          noarchive: true,
          maxSnippet: -1,
          maxImagePreview: "none",
          maxVideoPreview: -1,
        }}
        additionalMetaTags={[
          {
            property: "dc:creator",
            content: "Techgater",
          },
          {
            property: "keywords",
            content:
              "Expozy Blog",
          },
          {
            name: "application-name",
            content: "Expozy Blog",
          },
          {
            name: "viewport",
            content: "initial-scale=1, width=device-width",
          },
          {
            name: "theme-color",
            content: palette.light.primary.main,
          },
          {
            httpEquiv: "x-ua-compatible",
            content: "IE=edge; chrome=1",
          },
        ]}
        {...other}
      />
      {children}
    </>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Page;
