// @ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Header from "@/components/header";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "next/link";
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

// Custom Input component that only allows letters and spaces
const CustomInput = ({ onChange, ...props }) => {
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    // Use a regular expression to allow only letters (a-z, A-Z) and spaces
    const sanitizedValue = inputValue.replace(/[^a-zA-Z\s]/g, "");
    // Update the input value
    if (onChange) {
      onChange({ target: { value: sanitizedValue } });
    }
  };

  return <input ref={inputRef} onChange={handleInputChange} {...props} />;
};

const Page: React.FC = () => {
  let [textName, setTextName] = useState<string>("");
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const searchParams = useSearchParams();
  let search = searchParams.get("name");
  const router = useRouter();

  useEffect(() => {
    if (search !== null && search !== textName) {
      setTextName(search);
    }
  }, [search, textName]);

  const inputFocusRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (
      inputFocusRef.current &&
      document.activeElement !== inputFocusRef.current
    ) {
      inputFocusRef.current.focus({
        behavior: "smooth",
      });
    }

    if (search !== null && buttonRef.current) {
      buttonRef.current.click();
    }
  }, [search]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .get(`https://phinzi.com/convert?name=${textName}`)
      .then((res) => setDataSource(res.data));
  };

  const updateURL = (newTextName: string) => {
    router.push(`?name=${encodeURIComponent(newTextName)}`);
  };

  return (
    <div className="">
      <Header />
      <div>
        <form
          className="container gap flex justify-between"
          onSubmit={(e) => submitHandler(e)}
        >
          <CustomInput
            type="text"
            placeholder="Name"
            className="w-[70%]"
            value={textName}
            ref={inputFocusRef}
            onChange={(e) => {
              const newValue = e.target.value;
              setTextName(newValue);
              updateURL(newValue);
            }}
          />
          <Button type="submit" ref={buttonRef}>
            Calculate <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
      {dataSource ? (
        <>
          <div className="container mt-[30px] flex items-start justify-start">
            <table
              border={2}
              className="border-2 dark:border-white border-black"
            >
              <thead className="border-2  dark:border-white border-black p-[20px]">
                <tr className="border-2  dark:border-white border-black">
                  <th className="border-2  dark:border-white border-black px-[20px]">
                    Group
                  </th>
                  <th className="border-2  dark:border-white border-black">
                    Name
                  </th>
                  <th className="border-2  dark:border-white border-black px-[20px]">
                    Total
                  </th>
                  <th className="border-2  dark:border-white border-black px-[20px]">
                    V
                  </th>
                  <th className="border-2  dark:border-white border-black px-[20px]">
                    C
                  </th>
                </tr>
              </thead>
              <tbody className="border-2  dark:border-white border-black ">
                <tr className="border-2  dark:border-white border-black">
                  <td className="border-2  dark:border-white border-black">
                    C
                  </td>
                  <td className="px-[20px] border-2  dark:border-white border-black">
                    <table
                      className="px-[20px] table-padding"
                      dangerouslySetInnerHTML={{
                        __html:
                          typeof dataSource !== "undefined" &&
                          dataSource?.name_g2_block,
                      }}
                    ></table>
                  </td>

                  <td className="border-2  dark:border-white border-black">
                    {dataSource?.g2tot}
                  </td>
                  <td className="border-2  dark:border-white border-black">
                    {" "}
                    {dataSource?.g2vtot}
                  </td>
                  <td className="border-2  dark:border-white border-black">
                    {" "}
                    {dataSource?.g2nettot}
                  </td>
                </tr>
                <tr className="border-2  dark:border-white border-black">
                  <td className="border-2  dark:border-white border-black">
                    P
                  </td>
                  <td className="px-[20px] border-2  dark:border-white border-black">
                    <table
                      className="px-[20px] table-padding"
                      dangerouslySetInnerHTML={{
                        __html:
                          typeof dataSource !== "undefined" &&
                          dataSource?.name_g3_block,
                      }}
                    ></table>
                  </td>

                  <td className="border-2  dark:border-white border-black">
                    {dataSource?.g3tot}
                  </td>
                  <td className="border-2  dark:border-white border-black">
                    {" "}
                    {dataSource?.g3vtot}
                  </td>
                  <td className="border-2  dark:border-white border-black">
                    {" "}
                    {dataSource?.g3nettot}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="container flex  items-start mt-[10px] justify-between">
            {" "}
            Total Letters - {dataSource?.tot_letters}
            <Link href={"/"}>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setDataSource(null);
                  setTextName("");
                }}
              >
                Cancel
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <Image
              className="justify-center align-middle items-center"
              src={"/images/up.png"}
              alt="rabbit_showing_up"
              height={100}
              width={100}
            />
          </div>
          <div className="container flex justify-center align-middle">
            <h1>Please write your name to get started...</h1>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
