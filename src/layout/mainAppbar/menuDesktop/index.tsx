import React from "react";
import { useState, useEffect } from "react";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
// next
import NextLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
// material
import { Link } from "@mui/material";
import { useSelector } from "react-redux";
// components
import MenuDesktopPopover from "src/components/popover/menudesktop";
import RootStyled from "./styled";
import { fetchBlogCategories } from 'lib/dbConnect';


// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function MenuDesktopItem({ ...props }) {
  const {
    item,
    pathname,
    isHome,
    isOpen,
    isOffset,
    onOpen,
    isLoading,
    onClose,
    data,
    scrollPosition,
    router,
  } = props;
  const { title, path, isDropdown } = item;
  const anchorRef: any = React.useRef(null);
  const isActive: boolean = pathname === path;
  const { t } = useTranslation("common");
  if (isDropdown) {
    return (
      <>
        <Link
          ref={anchorRef}
          className={`link ${isOffset && isHome && "offset"}`}
          id="composition-button"
          aria-controls={isOpen ? "composition-menu" : undefined}
          aria-expanded={isOpen ? "true" : undefined}
          aria-haspopup="true"
          onClick={onOpen}>
          {t(title)}

          {isOpen ? (
            <KeyboardArrowUpRoundedIcon className="link-icon" />
          ) : (
            <KeyboardArrowDownRoundedIcon className="link-icon" />
          )}
        </Link>
        <MenuDesktopPopover
          isOpen={isOpen}
          scrollPosition={scrollPosition}
          onClose={onClose}
          isLoading={isLoading}
          data={data}
        />
      </>
    );
  }

  return (
    <Link
      key={title}
      onClick={() => {
        router.push(path);
      }}
      className={`link ${isActive && "active"}`}>
      {t(title)}
    </Link>
  );
}

export default function MenuDesktop({ ...props }) {
  const { isOffset, isHome, navConfig, isLeft } = props;
  const { pathname } = useRouter();
  const { categories } = useSelector(
    ({ categories }: { categories: any }) => categories
  );
  const isLoading = !categories;

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [scrollPosition, setPosition] = useState(0);
  const [blogCategories, setBlogCategories] = useState<any>(null);

  React.useLayoutEffect(() => {
    function updatePosition() {
      setPosition(window.pageYOffset);
    }
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedBlogCategories = await fetchBlogCategories();
        setBlogCategories(fetchedBlogCategories);
      } catch (error) {
        console.error('Error fetching fetchBlogCategories:', error);
      }
    }

    fetchData();

    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  interface BlogCategory {
    id: number;
    title: string;
    slug: string;
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <RootStyled direction="row" className={isLeft && "main"}>
      {blogCategories &&
        blogCategories.map((post: BlogCategory, index: number) => (
          <Link
          sx={{flexWrap: 'nowrap'}}
          key={post.id}
          onClick={() => {
            router.push(`?category_id=${post.id}`);
          }}
          className={`link`}>
          {post.title}
        </Link>
        ))}
    </RootStyled>
  );
}
