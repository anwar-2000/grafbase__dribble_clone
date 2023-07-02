import { ProjectInterface } from "@/common.types";
import ProjectCard from "@/components/ProjectCard";
import { fetchProjects } from "@/lib/actions";
import React from "react";

type ProjectsSearch = {
  projectsSearch: {
    edges: {
      node: ProjectInterface;
    }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
};

const Home = async () => {
  const data = (await fetchProjects()) as ProjectsSearch;
  const projectsToDisplay = data?.projectsSearch?.edges || [];

  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexstart flex-col paddings">
        categories
        <p className="no-result-text text-center">
          No Projects Found - create some
        </p>
      </section>
    );
  }
  return (
    <section className="flex-start flex-col paddings mb-16">
      <h1>categories</h1>

      <section className="projects-grid">
        {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
          <ProjectCard key={node?.id}
           id={node?.id}
           image = {node?.image} 
           title = {node?.title}
           name = {node?.createdBy?.name}
           avatarUrl = {node?.createdBy?.avatarUrl}
           userId = {node?.createdBy?.id}
           />
           
        ))}
      </section>

      <h1>LoadMore</h1>
    </section>
  );
};

export default Home;
