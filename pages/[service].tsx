import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../components/common/sidebar";
import styles from "../styles/Home.module.css";
import { useRecoilValue } from "recoil";
import {
  fileShortSvcNameSelector,
  fileState,
  fileStateFilter,
} from "../atoms/file";
import {
  Box,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import MethodStats from "../components/protoMethods/methodStats";
const Service: NextPage = (props: any) => {
  const shortSvcName = useRecoilValue(fileShortSvcNameSelector);
  const filter = useRecoilValue(fileStateFilter);
  const files = useRecoilValue(fileState);
  const protoInfo = Object.fromEntries(
    Object.entries(files).filter(([k, _]) => k === filter)
  )[filter];
  const messageTypes = protoInfo?.messageType?.map(
    (m: { name: string }) => m.name
  );
  const methods = protoInfo?.service.map((s) => s.method).flat();
  console.log(methods);
  return (
    <Sidebar services={shortSvcName} messages={messageTypes}>
      <div className={styles.container}>
        <Head>
          <title>{filter}</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SimpleGrid columns={3} spacingX="8px" spacingY="15px">
          <MethodStats methods={methods} />
        </SimpleGrid>
      </div>
    </Sidebar>
  );
};

export default Service;
