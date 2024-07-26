"use client";

import { insertMustImage, insertMustPost } from "@/apis/mustpost";
import InnerLayout from "@/components/common/Page/InnerLayout";
import { MustCategory, TNewMustPost } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Notify } from "notiflix";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import InputField from "./InputField";
import SelectCategory from "./SelectCategory";

import { useInputChange } from "@/hooks/useInput";
import { useAuthStore } from "@/zustand/authStore";
import { useRouter } from "next/navigation";

// type TMustInputs = {
//   title: string;
//   date: string;
//   category: MustCategory | null;
//   itemName: string;
//   company: string;
//   price: number;
//   content: string;
// };

type TCategory = {
  id: string;
  name: string;
};
function MustWriteForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [imgUrl, setImgUrl] = useState<string>("");
  const [category, setCategory] = useState<TCategory>();
  // const [inputs, setInputs] = useState<TMustInputs>({
  //   title: "",
  //   date: "",
  //   category: null,
  //   itemName: "",
  //   company: "",
  //   price: 0,
  //   content: "",
  // });

  // const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { value, name } = e.target;
  //   setInputs({
  //     ...inputs,
  //     [name]: value,
  //   });
  // };

  const { values: input, handler: onChangeInput } = useInputChange({
    title: "",
    date: "",
    itemName: "",
    company: "",
    price: 0,
    content: "",
  });
  const { title, date, itemName, company, price, content } = input;

  const selectCategoryName = (category: MustCategory) => {
    setCategory(category);
  };

  const { mutate: addMustPost } = useMutation({
    mutationFn: (newMustPost: TNewMustPost) => insertMustPost(newMustPost),
    onSuccess: () => {
      router.back();
    },
  });

  const { mutate: addImage } = useMutation({
    mutationFn: async (newMustPostImage: any) => {
      const formData = new FormData();
      formData.append("file", newMustPostImage);
      const response = await insertMustImage(formData);
      setImgUrl(`https://nqqsefrllkqytkwxfshk.supabase.co/storage/v1/object/public/mustposts/${response.path}`);
    },
  });

  const addImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const newMustPostImage = e.target.files[0];
      addImage(newMustPostImage);
    }
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const startDate = `${year}-${month}-${day}` as string;

  const addMustPostBtn = () => {
    if (!title.trim() || !category || !itemName.trim() || !company.trim() || !content.trim()) {
      Notify.failure("모든 항목을 입력해주세요");
      return;
    }
    if (!user) {
      return;
    }

    const newMustPost: TNewMustPost = {
      id: uuidv4(),
      user_id: user.id,
      title,
      category_id: category.id,
      content,
      img_url: imgUrl,
      item: itemName,
      location: company,
      price,
    };
    addMustPost(newMustPost);
  };

  return (
    <InnerLayout>
      <form className="flex flex-col gap-5">
        <InputField
          labelName="제목"
          name="title"
          type="text"
          value={title}
          placeHolder="제목을 입력해주세요"
          minLength={2}
          onchangeValue={onChangeInput}
        />

        <div className="flex flex-row justify-between gap-2">
          <div className="pr-[72px] flex-grow">
            <InputField labelName="작성일자" name="date" type="text" value={startDate} onchangeValue={onChangeInput} />
          </div>
          <SelectCategory selectCategoryName={selectCategoryName} />
        </div>

        <InputField
          labelName="상품이름"
          name="itemName"
          type="text"
          value={itemName}
          placeHolder="상품 이름을 입력해주세요."
          minLength={2}
          onchangeValue={onChangeInput}
        />

        <InputField
          labelName="제작업체"
          name="company"
          type="text"
          value={company}
          placeHolder="구매처룰 입력해주세요."
          minLength={1}
          onchangeValue={onChangeInput}
        />

        <InputField
          labelName="판매가격"
          name="price"
          type="number"
          value={price}
          placeHolder="숫자만 입력해주세요"
          minLength={2}
          onchangeValue={onChangeInput}
        />

        <InputField labelName="이미지" type="file" onchangeValue={addImageHandler} />
        {imgUrl && <Image src={imgUrl} alt="포스팅한 이미지" width={200} height={200} />}
        <div className="mt-[22px] mb-[64px] p-6 border-b border-black">
          <textarea
            name="content"
            value={content}
            placeholder="※ 여기에 글을 작성해주세요."
            onChange={onChangeInput}
            className="w-full h-[456px] outline-none"
          ></textarea>
        </div>
      </form>
      <div className="flex justify-center">
        {/* <Button onClick={addMustPostBtn} className="w-[400px] py-3 text-[26px]">
          포스팅 하기
        </Button> */}
        <button
          onClick={addMustPostBtn}
          className="w-[400px] py-5 text-[26px] text-white font-bold px-4 focus:outline-none bg-black hover:bg-slate-800 rounded-full"
        >
          포스팅 하기
        </button>
      </div>
    </InnerLayout>
  );
}

export default MustWriteForm;