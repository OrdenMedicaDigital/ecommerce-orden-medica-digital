"use client";

import {
  Button,
  Column,
  Flex,
  Line,
  Logo,
  NavIcon,
  Option,
  Row,
  SmartLink,
  ToggleButton,
  UserMenu,
} from "@/once-ui/components";
import { usePathname } from "next/navigation";
import React from "react";

interface HeaderProps {
  authenticated: boolean;
  avatar?: string;
  name?: string;
  subline?: string;
}

const Header: React.FC<HeaderProps> = ({
  authenticated,
  avatar,
  name,
  subline,
}) => {
  const pathname = usePathname() ?? "";

  return (
    <Row
      as="header"
      borderBottom="neutral-medium"
      fillWidth
      paddingX="m"
      height="56"
      vertical="center"
      background="surface"
    >
      <Row
        maxWidth={"xl"}
        fillWidth
        vertical="center"
        gap="8"
        horizontal="center"
      >
        <Row>
          <Logo size="s" />
        </Row>
      </Row>
    </Row>
  );
};

Header.displayName = "Header";
export { Header };
