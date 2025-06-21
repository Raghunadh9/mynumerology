// @ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Header from "@/components/header";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DataSource {
  name_g2_block?: string;
  name_g3_block?: string;
  g2tot?: number;
  g2vtot?: number;
  g2nettot?: number;
  g3tot?: number;
  g3vtot?: number;
  g3nettot?: number;
  tot_letters?: number;
}
import { useSearchParams } from "next/navigation";

const Page: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
   const searchParams = useSearchParams()
  const name = searchParams.get('name')
  const [textName, setTextName] = useState<string>(name||"");

  const saveHandler = async (dataSource: DataSource) => {
    setLoading(true);
    await axios
      .post("/api/save", {
        chaldean: dataSource.name_g2_block,
        pythogorous: dataSource.name_g3_block,
        tot_letters: dataSource.tot_letters,
        g2tot: dataSource.g2tot,
        g3tot: dataSource.g3tot,
        g2vtot: dataSource.g2vtot,
        g3vtot: dataSource.g3vtot,
        g2nettot: dataSource.g2nettot,
        g3nettot: dataSource.g3nettot,
      })
      .then((res) => {
        setLoading(false);
        toast.success("Name successfully added to Database ⭐!");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err);
      });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Extract digits from the input
    const digits = textName.match(/\d/g) || [];
    const digitsSum = digits.reduce((sum, digit) => sum + parseInt(digit), 0);
    const numDigits = digits.length;

    // Remove digits for API call to get base calculation
    const nameWithoutDigits = textName.replace(/\d/g, "");
    const nameForApi = nameWithoutDigits
      .replace(/[.,;()&/:]/g, "") // Remove unwanted characters
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim(); // Remove leading and trailing spaces

    // Making an API request without updating the URL
    axios
      .get(`https://weljon.com/convert?name=${nameForApi}`)
      .then((res) => {
        // Ensure we have numeric values by using Number() and defaulting to 0
        const baseData = {
          ...res.data,
          tot_letters: Number(res.data.tot_letters) || 0,
          g2tot: Number(res.data.g2tot) || 0,
          g3tot: Number(res.data.g3tot) || 0,
          g2vtot: Number(res.data.g2vtot) || 0,
          g3vtot: Number(res.data.g3vtot) || 0,
          g2nettot: Number(res.data.g2nettot) || 0,
          g3nettot: Number(res.data.g3nettot) || 0,
        };

        // Add digit calculations but keep original HTML blocks
        const modifiedData = {
          ...baseData,
          name_g2_block: baseData.name_g2_block, // Keep original HTML blocks
          name_g3_block: baseData.name_g3_block, // Keep original HTML blocks
          tot_letters: baseData.tot_letters + numDigits,
          g2tot: baseData.g2tot + digitsSum,
          g3tot: baseData.g3tot + digitsSum,
          g2nettot: baseData.g2tot + digitsSum - baseData.g2vtot,
          g3nettot: baseData.g3tot + digitsSum - baseData.g3vtot,
        };

        console.log("Base data:", baseData);
        console.log("Modified data:", modifiedData);
        console.log("Digits:", digits, "Sum:", digitsSum);

        setDataSource(modifiedData);
      })
      .catch((err) => toast.error(err));
  };

  const inputFocusRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    inputFocusRef.current.focus();
  }, []);

  return loading ? (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-gray-900 rounded-full" />
    </div>
  ) : (
    <div className="">
      <Header />
      <div>
        <form
          className="container gap flex justify-between"
          onSubmit={submitHandler}
        >
          <Input
            type="text"
            placeholder="Name"
            className="w-[70%]"
            value={textName}
            ref={inputFocusRef}
            onChange={(e) => setTextName(e.target.value)}
          />

          <Button
            type="submit"
            ref={buttonRef}
            disabled={textName.length === 0}
          >
            Calculate <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
      {dataSource ? (
        <>
          <div className="container mt-[30px] flex items-start justify-start">
            <table
              border={2}
              className="border-4 dark:border-white border-yellow-600"
            >
              <thead className="border-4 dark:border-white border-yellow-600 p-[20px]">
                <tr className="border-4 dark:border-white border-yellow-600">
                  <th className="border-4 dark:border-white border-yellow-600 bg-green-600 text-white text-2xl font-[900]">
                    Grp.
                  </th>
                  <th className="border-4 dark:border-white border-yellow-600 bg-green-600 text-white text-2xl font-[900]">
                    Name
                  </th>
                  <th className="border-4 dark:border-white border-yellow-600 bg-green-600 text-white text-2xl font-[900]">
                    Total
                  </th>
                  <th className="border-4 dark:border-white border-yellow-600 bg-green-600 text-white text-2xl font-[900]">
                    V
                  </th>
                  <th className="border-4 dark:border-white border-yellow-600 bg-green-600 text-white text-2xl font-[900]">
                    C
                  </th>
                </tr>
              </thead>
              <tbody className="border-4 dark:border-white border-yellow-600 text-[#960084] font-[900]">
                <tr className="border-4 dark:border-white border-yellow-600">
                  <td className="border-4 dark:border-white border-yellow-600 bg-green-600 text-white text-2xl ">
                    C
                  </td>
                  <td className="border-4 dark:border-white border-yellow-600">
                    <table
                      className="table-padding text-2xl"
                      dangerouslySetInnerHTML={{
                        __html: dataSource?.name_g2_block || "",
                      }}
                    ></table>
                  </td>
                  <td className="border-4 dark:border-white border-yellow-600 text-2xl bg-green-600 text-white ">
                    {dataSource?.g2tot || 0}
                  </td>
                  <td className="border-4 dark:border-white border-yellow-600 text-2xl bg-green-600 text-white ">
                    {dataSource?.g2vtot || 0}
                  </td>
                  <td className="border-4 dark:border-white border-yellow-600 text-2xl bg-green-600 text-white ">
                    {dataSource?.g2nettot || 0}
                  </td>
                </tr>
                <tr className="border-4 dark:border-white border-yellow-600">
                  <td className="border-4 dark:border-white border-yellow-600 bg-green-600 text-white text-2xl ">
                    P
                  </td>
                  <td className="border-4 dark:border-white border-yellow-600">
                    <table
                      className="table-padding text-2xl"
                      dangerouslySetInnerHTML={{
                        __html: dataSource?.name_g3_block || "",
                      }}
                    ></table>
                  </td>
                  <td className="border-4 dark:border-white border-yellow-600 text-2xl bg-green-600 text-white ">
                    {dataSource?.g3tot || 0}
                  </td>
                  <td className="border-4 dark:border-white border-yellow-600 text-2xl bg-green-600 text-white ">
                    {dataSource?.g3vtot || 0}
                  </td>
                  <td className="border-4 dark:border-white border-yellow-600 text-2xl bg-green-600 text-white ">
                    {dataSource?.g3nettot || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="container flex items-start mt-[10px] justify-between">
            <span className="text-green-600 text-2xl font-[900]">
              Total Letters - {dataSource?.tot_letters || 0}
            </span>
            <div className="">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant={"default"} className="mr-[10px]">
                    Save
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Do you want to save this name -{" "}
                      <b>{textName.toUpperCase()}</b> ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => saveHandler(dataSource)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Link href={"/"}>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setTextName("");
                    setDataSource(null);
                  }}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </>
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default Page;
