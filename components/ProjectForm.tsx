"use client"

import { FormState, ProjectInterface, SessionInterface } from "@/common.types";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import Button from "./Button";
import { createProject, fetchToken, updateProject } from "@/lib/actions";
import { useRouter } from "next/navigation";
type Props = {
  type: string;
  session: SessionInterface;
  project : ProjectInterface
};

const ProjectForm: React.FC<Props> = ({ type, session , project}) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    liveProjectUrl: project?.liveProjectUrl || "",
    githubUrl: project?.githubUrl || "",
    catgeory: project?.catgeory || ""
})

  const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setSubmitting(true)

        const {token} = await fetchToken();

        try {
          if(type === "create"){
           let response =  await createProject(form,session?.user?.id,token)
            console.log(response)
            if (response) router.push('/')
          }
          if (type === "edit") {
            await updateProject(form, project?.id as string, token)

            router.push("/")
        }
        } catch (error) {
          console.log(error)
        }finally{
          setSubmitting(false)
        }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.includes("image")) {
      return alert("Please Upload an Image File");
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;
      handleStateChange("image", result);
    };
  };

  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  return (
    <form onSubmit={handleFormSubmit} className="flexstart form">
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form.image && "Choose a poster for your project"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          required={type === "create" ? true : false}
          className="form_image-input"
          onChange={handleImageChange}
        />
        {form.image && (
          <Image
            alt=""
            src={form?.image}
            className="sm:p-10 object-contain z-20"
            height ={50}
            width={60}
          />
        )}
      </div>

      <FormField
        title="title"
        state={form.title}
        placeholder="Title"
        setState={(value) => handleStateChange("title", value)}
      />

      <FormField
        title="description"
        state={form.description}
        placeholder="Showcase and Discover Remarkabale dev projects"
        setState={(value) => handleStateChange("description", value)}
      />

      <FormField
        type="url"
        title="website URL"
        state={form.liveProjectUrl as string}
        placeholder="https://...."
        setState={(value) => handleStateChange("liveProjectUrl", value)}
      />

      <FormField
        type="url"
        title="Github URL"
        state={form.githubUrl}
        placeholder="https://github.com/...."
        setState={(value) => handleStateChange("githubUrl", value)}
      />

      <CustomMenu
        title="category"
        state={form.catgeory}
        filters={categoryFilters}
        setState={(value) => handleStateChange("catgeory", value)}
      />

      <div className="flexStart w-full">
          <Button
          type="submit"
          title={
            submitting
              ? `${type === "create" ? "Creating" : "Editing"}`
              : `${type === "create" ? "Create" : "Edit"}`
          }
          LeftIcon={submitting ? "" : "/plus.svg"}
          isSubmitting={submitting}
        />
      </div>
    </form>
  );
};

export default ProjectForm;
