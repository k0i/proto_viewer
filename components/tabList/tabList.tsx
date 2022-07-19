import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { fileMethodFilter, fileState, fileStateFilter } from "../../atoms/file";
import { packageState } from "../../atoms/package";
import { serviceState } from "../../atoms/service";
import styles from "../../styles/Home.module.css";
import MethodCard from "../protoMethods/methodCard";

export default function TabsList() {
  const [pkg, setPackage] = useRecoilState(packageState);
  const [services, setServices] = useRecoilState(serviceState);
  const [files, setFiles] = useRecoilState(fileState);
  const [fileFilter, setFileFilter] = useRecoilState(fileStateFilter);
  const [metodFilter, setMethodFilter] = useRecoilState(fileMethodFilter);
  return (
    <Tabs
      align="center"
      variant="soft-rounded"
      colorScheme="purple"
      className={styles.main}
      p="12"
      rounded="md"
      bg="white"
    >
      <TabList>
        {services.map((s) => (
          <Tab
            key={s}
            onClick={() => {
              setFileFilter(s);
              setPackage(files[s]?.package);
            }}
          >
            {Object.keys(files).length !== 0 &&
              files[s]?.service.map((m: { name: string }) => (
                <p key={m.name}>{m.name}</p>
              ))}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {services.map((s) => (
          <TabPanel key={s}>
            <Accordion allowToggle>
              {Object.keys(files).length !== 0 &&
                files[s]?.service.map((s) =>
                  s.method.map((m) => (
                    <AccordionItem
                      key={m.name}
                      onClick={() => {
                        setMethodFilter(m.name);
                      }}
                    >
                      <h2>
                        <AccordionButton
                          _expanded={{ bg: "blue.200", color: "white" }}
                        >
                          <Box flex="1" textAlign="left" m="2" p="4">
                            {m.name}
                          </Box>
                          <Box flex="1" textAlign="right" m="2">
                            <Badge mr="6" colorScheme="green">
                              Request
                            </Badge>
                          </Box>
                          <Box>
                            {m.inputType}
                            <Badge ml="4" mr="6" colorScheme="red">
                              Response
                            </Badge>
                            {m.outputType}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <MethodCard method={m} />
                      </AccordionPanel>
                    </AccordionItem>
                  ))
                )}
            </Accordion>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
