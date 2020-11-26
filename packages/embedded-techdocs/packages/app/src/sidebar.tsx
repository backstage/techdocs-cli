import React, { FC, useContext } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import { Link, makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';

import {
  Sidebar,
  SidebarItem,
  SidebarDivider,
  sidebarConfig,
  SidebarContext,
  SidebarSpace,
} from '@backstage/core';

export const AppSidebar = () => (
  <Sidebar>
    <SidebarLogo />
    <SidebarDivider />
    {/* Global nav, not org-specific */}
    <SidebarItem icon={HomeIcon} to="./" text="Home" />
    <SidebarItem icon={LibraryBooks} to="/docs" text="Docs" />
    <SidebarDivider />
    {/* End global nav */}
    <SidebarDivider />
    <SidebarSpace />
    <SidebarDivider />
  </Sidebar>
);

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo: FC<{}> = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};
