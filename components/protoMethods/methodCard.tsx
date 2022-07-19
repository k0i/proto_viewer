import {
  Box,
  FormControl,
  Flex,
  FormLabel,
  Input,
  Tag,
  Button,
  Code,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { MouseEvent, ChangeEvent, useState } from "react";
import { useRecoilValue } from "recoil";
import { fileState, fileStateFilter } from "../../atoms/file";
import { packageState } from "../../atoms/package";
import TypeBadge from "./typeBadge";

export type Method = {
  name: string;
  inputType: string;
  outputType: string;
};

export default function MethodCard({ method, ...rest }: { method: Method }) {
  const router = useRouter();
  const pkg = useRecoilValue(packageState);
  const packageName = `.${pkg}.`;
  const files = useRecoilValue(fileState);
  const fileFilter = useRecoilValue(fileStateFilter);
  const reqDetail = files[fileFilter]?.messageType.find(
    (m: { name: string }) => packageName + m.name === method.inputType
  );
  const resDetail = files[fileFilter]?.messageType.find(
    (m: { name: string }) => packageName + m.name === method.outputType
  );
  const [inputVal, setInputVal] = useState<Object>(Object.create(null));
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputVal({
      ...inputVal,
      [name]: value,
    });
  };
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    fetch(`${fileFilter}/${method.name}`, {
      method: "POST",
      body: JSON.stringify({
        ...inputVal,
        method: method.name,
        service: fileFilter,
        reqDetail,
        resDetail,
      }),
    }).then(() => router.push(`${fileFilter}/${method.name}`));
  };
  return (
    <Box w="100%">
      <Tag p="2" size="lg">
        {method.inputType}
      </Tag>
      <Box shadow="lg" w="100%" rounded="lg" p="4" bg="white" {...rest}>
        <FormControl>
          {reqDetail?.field?.map((f) => (
            <>
              <Flex w="90%" key={f.name + f.type} py="1">
                <FormLabel w="40%">
                  <Flex>
                    <Box>{f.name}</Box>
                    <TypeBadge type={f.type} />
                  </Flex>
                </FormLabel>
                <Input w="50%" name={f.name} onChange={handleInputChange} />
              </Flex>
            </>
          ))}
          {JSON.stringify(inputVal) !== "{}" && (
            <Code variant="solid" colorScheme="blackAlpha" mt="10">
              {JSON.stringify(inputVal).length >= 200
                ? `${JSON.stringify(inputVal).slice(0, 199) + "..."}`
                : JSON.stringify(inputVal)}
            </Code>
          )}
        </FormControl>
        <Button
          px="20"
          mt="10"
          variant="outline"
          color="purple.400"
          onClick={handleClick}
        >
          Send Request
        </Button>
      </Box>
    </Box>
  );
}
