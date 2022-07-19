import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { FileDescriptions, GrpcServices } from "./api/types";
import { useRecoilState } from "recoil";
import { serviceState } from "../atoms/service";
import { fileState } from "../atoms/file";
import NavBar from "../components/common/navbar";
import TabsList from "../components/tabList/tabList";
import { depState } from "../atoms/dependencies";

const Home: NextPage = () => {
  const [services, setServices] = useRecoilState(serviceState);
  const [files, setFiles] = useRecoilState(fileState);
  const [deps, setDeps] = useRecoilState(depState);

  useEffect(() => {
    const fetchAll = async () => {
      const svcs = await fetch("/api/services");
      const svcBody = (await svcs.json()) as GrpcServices;
      setServices(svcBody.services);
      const sbls = await fetch("/api/symbol", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(svcBody),
      });
      const sblBody = (await sbls.json()) as FileDescriptions;
      setFiles(sblBody.files);
      const depTree = Array.from(
        new Set(
          Object.values(sblBody.files)
            .filter((f) => f.dependency?.length > 0)
            .map((f) => f.dependency)
            .flat()
        )
      );
      console.log(sblBody.files);
      const deps = await fetch("/api/dependencies", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dependencies: depTree,
        }),
      });
      const depsInfo = await deps.json();
      setDeps(depsInfo.files);
    };
    fetchAll();
  }, []);
  return (
    <NavBar>
      <div className={styles.container}>
        <Head>
          <title>grpc reflection</title>
          <meta name="description" content="reflection info" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <TabsList />
      </div>
    </NavBar>
  );
};

export default Home;
