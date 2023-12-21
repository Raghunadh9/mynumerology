"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ButtonComponent = ({ id }: { id: any }) => {
  const router = useRouter();
  const deleteHandler = async (itemId: string) => {
    try {
      await axios
        .delete(`/api/save`, {
          data: {
            id: itemId,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          router.refresh();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {" "}
      <Button variant={"destructive"} onClick={() => deleteHandler(id)}>
        delete
      </Button>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ButtonComponent;
