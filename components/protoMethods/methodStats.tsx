import { Badge, Box, Spacer, Stat, StatLabel, VStack } from "@chakra-ui/react";
import React from "react";

export type Method = {
  name: string;
  inputType: string;
  outputType: string;
};

const MethodStat = ({ method }: { method: Method }) => {
  return (
    <Box as="button">
      <Stat
        borderRadius="md"
        h="200px"
        border="1px"
        bg="white"
        boxShadow="lg"
        p="6"
        rounded="md"
      >
        <VStack align="center">
          <StatLabel fontSize="xl" as="em">
            {method.name}
          </StatLabel>
          <Spacer />
          <Badge ml="1" fontSize="0.8em" colorScheme="green">
            Request
          </Badge>
          <StatLabel as="cite">
            {method.inputType}
            <br />
          </StatLabel>
          <Badge ml="1" fontSize="0.8em" colorScheme="purple">
            Response
          </Badge>
          <StatLabel as="em">
            {method.outputType}
            <br />
          </StatLabel>
        </VStack>
      </Stat>
    </Box>
  );
};

export default function MethodStats({ methods }: { methods: Method[] }) {
  return (
    <>
      {methods?.map((m) => (
        <MethodStat key={m.name} method={m} />
      ))}
    </>
  );
}
