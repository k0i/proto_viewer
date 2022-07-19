import { Badge } from "@chakra-ui/react";
import React from "react";
import { GrpcFieldType } from "../../pages/api/types";

const typeBadge = ({ type }: { type: GrpcFieldType }) => {
  switch (type) {
    case "TYPE_STRING":
      return (
        <Badge ml="2" p="1" colorScheme="red">
          {type}
        </Badge>
      );
    case "TYPE_INT32":
      return (
        <Badge ml="2" p="1" colorScheme="blue">
          {type}
        </Badge>
      );
    case "TYPE_ENUM":
      return (
        <Badge ml="2" p="1" colorScheme="purple">
          {type}
        </Badge>
      );
    case "TYPE_MESSAGE":
      return (
        <Badge ml="2" p="1" colorScheme="teal">
          {type}
        </Badge>
      );
    default:
      return (
        <Badge ml="2" p="1">
          {type}
        </Badge>
      );
  }
};

export default typeBadge;
