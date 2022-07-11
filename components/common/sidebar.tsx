import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { FaReact } from "react-icons/fa";
import { IconType } from "react-icons";
import { GrpcServiceName } from "../../pages/api/types";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

export default function Sidebar({
  children,
  services,
  messages,
}: {
  children: ReactNode;
  services: GrpcServiceName[];
  messages: string[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        linkItems={services}
        messages={messages}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            linkItems={services}
            messages={messages}
          />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml="400" p="2">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  linkItems: GrpcServiceName[];
  messages: string[];
  onClose: () => void;
}

const SidebarContent = ({
  onClose,
  linkItems,
  messages,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w="400px"
      pos="fixed"
      h="full"
      {...rest}
    >
      <VStack alignItems="left" mx="2" justifyContent="space-between">
        <Text fontSize="2xl" as="em">
          Messages
        </Text>
        {messages &&
          messages.slice(0, 22).map((m, i) =>
            i !== 21 ? (
              <NavItem
                key={m}
                icon={FaReact}
                _hover={{
                  bg: "cyan.200",
                  color: "white",
                }}
              >
                <Text>{m.length >= 35 ? m.slice(0, 35) + "..." : m}</Text>
              </NavItem>
            ) : (
              <Text as="em">...</Text>
            )
          )}
      </VStack>
      <Spacer h="8" />
      <VStack alignItems="left" mx="2" justifyContent="center">
        <Text fontSize="2xl" as="em">
          Services
        </Text>
        {linkItems.map((link) => (
          <NavItem
            key={link}
            p="1"
            icon={FaReact}
            _hover={{
              bg: "purple.100",
              color: "white",
            }}
          >
            <Text as="i">{link}</Text>
          </NavItem>
        ))}
      </VStack>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactJSXElement;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FaReact />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};
