'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

const useSearchFormSubmit = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const term = searchText.trim();
    if (term) {
      const params = new URLSearchParams({ searchText: term });
      if (category) params.set("productType", category);
      router.push(`/shop?${params.toString()}`);
    } else {
      router.push("/");
    }
    setSearchText("");
    setCategory("");
  };

  return {
    searchText,
    category,
    setSearchText,
    setCategory,
    handleSubmit,
  };
};

export default useSearchFormSubmit;
