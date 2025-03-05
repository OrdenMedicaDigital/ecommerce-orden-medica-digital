"use client";

import { useSidebarStore } from "@/app/store/sidebar";
import {
  Column,
  Icon,
  Line,
  Row,
  SmartLink,
  Text,
  ToggleButton,
} from "@/once-ui/components";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Sidebar: React.FC = () => {
  const pathname = usePathname() ?? "";
  const { isMobile, setIsMobile, open, toggle } = useSidebarStore();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  return (
    <Column
      maxWidth={16}
      fill
      paddingX="16"
      paddingY="32"
      gap="m"
      background="page"
      border="neutral-weak"
      radius="l"
      position="fixed"
      left="0"
      top="0"
      zIndex={7}
      style={{
        transform: !isMobile || open ? "translateX(0)" : "translateX(-400px)",
        transition: "transform 0.3s",
      }}
    >
      <Column fill paddingX="xs" gap="m">
        <Column fillWidth gap="4">
          <Text
            variant="body-default-xs"
            onBackground="neutral-weak"
            marginBottom="8"
            marginLeft="16"
          >
            Menu
          </Text>
          <Line />
          
          {/* Home Button */}
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "/"}
          >
            <Row
              fillWidth
              padding="4"
              vertical="center"
              gap="12"
              textVariant="label-default-s"
            >
              <SmartLink onClick={toggle} fillWidth href="/">
                <Icon name="home" onBackground="neutral-weak" size="xs" />
                Inicio
              </SmartLink>
            </Row>
          </ToggleButton>
          
          {/* Products Button */}
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "/products"}
          >
            <Row
              fillWidth
              padding="4"
              vertical="center"
              gap="12"
              textVariant="label-default-s"
            >
              <SmartLink onClick={toggle} fillWidth href="/products">
                <Icon name="layout" onBackground="neutral-weak" size="xs" />
                Productos
              </SmartLink>
            </Row>
          </ToggleButton>
          
          {/* Categories Button */}
          <ToggleButton
            fillWidth
            justifyContent="flex-start"
            selected={pathname === "/categories"}
          >
            <Row
              fillWidth
              padding="4"
              vertical="center"
              gap="12"
              textVariant="label-default-s"
            >
              <SmartLink onClick={toggle} fillWidth href="/categories">
                <Icon name="tag" onBackground="neutral-weak" size="xs" />
                Categorías
              </SmartLink>
            </Row>
          </ToggleButton>
        </Column>
      </Column>
    </Column>
  );
};

Sidebar.displayName = "Sidebar";
export { Sidebar };